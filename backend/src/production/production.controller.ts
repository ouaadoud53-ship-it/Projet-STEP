import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { LibelleProductionService } from './production.service';
import { CreateLibelleProductionDto, UpdateLibelleProductionDto, CreateBulkLibelleProductionDto } from './production.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('production')
export class LibelleProductionController {
  constructor(private readonly productionService: LibelleProductionService) {}

  @Post('bulk')
  createBulk(@Request() req, @Body() createBulkDto: CreateBulkLibelleProductionDto) {
    return this.productionService.createBulk(createBulkDto, req.user.id);
  }

  @Post()
  create(@Request() req, @Body() createDto: CreateLibelleProductionDto) {
    return this.productionService.create(createDto, req.user.id);
  }

  @Get()
  findAll(
    @Request() req,
    @Query('ouvrageId') ouvrageId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 50;
    return this.productionService.findAll(req.user.id, ouvrageId, search, pageNum, limitNum);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.productionService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateDto: UpdateLibelleProductionDto) {
    return this.productionService.update(id, updateDto, req.user.id);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.productionService.remove(id, req.user.id);
  }
}
