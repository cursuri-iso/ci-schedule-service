import { ScheduleDto } from './schedule.dto';

export class ScheduleRequestDto {
    added?: ScheduleDto[];

    updated?: ScheduleDto[];

    deleted?: ScheduleDto[];
}
