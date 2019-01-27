import { Controller, Post, Body, Get, Res, Query, HttpStatus, Param, Delete, Patch } from '@nestjs/common';

import { ScheduleService } from './schedule.service';
import { ProgramDto } from '../models/program.dto';
import { ScheduleRequestDto } from '../models/schedule-request.dto';

@Controller('programs')
export class ScheduleController {
    constructor(private service: ScheduleService) {}

    @Get('/:org_id/:training_id/:year')
    async getProgram(@Param('org_id') orgId: string, @Param('training_id') trainingId: string, @Param() year: number) {
        const ensuredYear = (year && Number.isInteger(year)) ? year : new Date().getFullYear();

        return await this.service.getSchedules(orgId, trainingId, ensuredYear);
    }

    @Post()
    async processScheduleRequest(@Body() dto: ScheduleRequestDto) {
        await this.service.processRequest(dto);
    }
}
