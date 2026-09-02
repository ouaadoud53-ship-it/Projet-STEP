import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { SerieService } from './serie.service';
import { CreateSerieDto, UpdateSerieDto } from './serie.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('series')
export class SerieController {
  constructor(private readonly serieService: SerieService) {}

  @Post()
  create(@Request() req, @Body() createSerieDto: CreateSerieDto) {
    return this.serieService.create(createSerieDto, req.user.id);
  }

  @Get()
  findAll(
    @Request() req,
    @Query('marcheId') marcheId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 50;
    return this.serieService.findAll(req.user.id, marcheId, search, pageNum, limitNum);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.serieService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateSerieDto: UpdateSerieDto) {
    return this.serieService.update(id, updateSerieDto, req.user.id);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.serieService.remove(id, req.user.id);
  }
}
