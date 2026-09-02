import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { OuvrageService } from './ouvrage.service';
import { CreateOuvrageDto, UpdateOuvrageDto } from './ouvrage.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ouvrages')
export class OuvrageController {
  constructor(private readonly ouvrageService: OuvrageService) {}

  @Post()
  create(@Request() req, @Body() createOuvrageDto: CreateOuvrageDto) {
    return this.ouvrageService.create(createOuvrageDto, req.user.id);
  }

  @Get()
  findAll(
    @Request() req,
    @Query('serieId') serieId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 50;
    return this.ouvrageService.findAll(req.user.id, serieId, search, pageNum, limitNum);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.ouvrageService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateOuvrageDto: UpdateOuvrageDto) {
    return this.ouvrageService.update(id, updateOuvrageDto, req.user.id);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.ouvrageService.remove(id, req.user.id);
  }
}
