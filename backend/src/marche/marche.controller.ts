import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Optional, UseGuards, Request } from '@nestjs/common';
import { MarcheService } from './marche.service';
import { CreateMarcheDto, UpdateMarcheDto, EtatMarche } from './marche.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('marches')
export class MarcheController {
  constructor(private readonly marcheService: MarcheService) {}

  @Post()
  create(@Request() req, @Body() createMarcheDto: CreateMarcheDto) {
    return this.marcheService.create(createMarcheDto, req.user.id);
  }

  @Get()
  findAll(
    @Request() req,
    @Query('search') search?: string,
    @Query('etat') etat?: EtatMarche,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.marcheService.findAll(req.user.id, search, etat, pageNum, limitNum);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.marcheService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateMarcheDto: UpdateMarcheDto) {
    return this.marcheService.update(id, updateMarcheDto, req.user.id);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.marcheService.remove(id, req.user.id);
  }
}
