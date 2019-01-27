import { Entity, Column } from 'typeorm';

import { EntityModel } from './entity.model';
import { IsString, Length, IsDate, IsInt, IsBoolean, IsNumber, IsPositive, Max, Min, IsMongoId, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { ScheduleModel } from './schedule.model';

@Entity('programs')
export class ProgramModel extends EntityModel {
    @Column()
    @IsMongoId()
    // tslint:disable-next-line:variable-name
    training_id: string;

    @Column()
    @IsMongoId()
    // tslint:disable-next-line:variable-name
    org_id: string;

    @Column()
    @IsInt()
    year: number;

    @Column()
    @ValidateNested({ each: true })
    schedules: ScheduleModel[];
}
