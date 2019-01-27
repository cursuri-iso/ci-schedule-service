import { Controller, Post, Body, Get, Res, Query, HttpStatus, Param, Delete, Patch } from '@nestjs/common';

import { ScheduleService } from './schedule.service';
import { ScheduleRequestDto } from '../models/schedule-request.dto';
import { PagedList, buildPaginationMetadata } from '../models/pagedList.model';
import { ScheduleDto } from '../models/schedule.dto';
import { PaginationPipe } from '../../pipes/pagination.pipe';
import { PaginationModel } from '../models/pagination.model';
import { SortingPipe } from '../../pipes/sorting.pipe';
import { SortingModel } from '../models/sorting.model';
import { SearchPipe } from '../../pipes/search.pipe';
import { SearchModel } from '../models/search.model';

@Controller('programs')
export class ScheduleController {
    constructor(private service: ScheduleService) {}

    @Get('/:org_id/:training_id')
    async getProgram(@Res() resp,
                     @Param('org_id') orgId: string,
                     @Param('training_id') trainingId: string,
                     @Query(new PaginationPipe()) pagination?: PaginationModel,
                     @Query(new SortingPipe()) sorting?: SortingModel,
                     @Query(new SearchPipe()) search?: SearchModel) {
        const result: PagedList<ScheduleDto> = await this.service.getSchedules(orgId, trainingId, pagination, sorting, search);
        const meta = buildPaginationMetadata(result, 'programs', orgId, trainingId);

        resp.set('x-pagination', JSON.stringify(meta));
        resp.status(HttpStatus.OK).json(result);
    }

    @Post()
    async processScheduleRequest(@Body() dto: ScheduleRequestDto) {
        await this.service.processRequest(dto);
    }
}
