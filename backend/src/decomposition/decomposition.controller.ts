import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { DecompositionService } from './decomposition.service';
import { CreateDecompositionDto, UpdateDecompositionDto } from './decomposition.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('decompositions')
export class DecompositionController {
  constructor(private readonly decompositionService: DecompositionService) {}

  @Post()
  create(@Request() req, @Body() createDto: CreateDecompositionDto) {
    return this.decompositionService.create(createDto, req.user.id);
  }

  @Get()
  findAll(
    @Request() req,
    @Query('libelleProductionId') libelleProductionId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 50;
    return this.decompositionService.findAll(req.user.id, libelleProductionId, search, pageNum, limitNum);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.decompositionService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateDto: UpdateDecompositionDto) {
    return this.decompositionService.update(id, updateDto, req.user.id);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.decompositionService.remove(id, req.user.id);
  }
}
