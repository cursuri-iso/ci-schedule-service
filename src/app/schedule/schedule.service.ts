import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../../shared/database/database.service';
import { RabbitMessageQueue } from '../../shared/mq/rabbit.mq.component';
import { ProgramModel } from '../models/program.model';
import { ProgramDto } from '../models/program.dto';
import { ObjectID } from 'mongodb';
import { ScheduleRequestDto } from '../models/schedule-request.dto';
import { ScheduleDto } from '../models/schedule.dto';
import { ScheduleModel } from '../models/schedule.model';

@Injectable()
export class ScheduleService {
    constructor(private databaseService: DatabaseService, private mqService: RabbitMessageQueue) { }

    async getSchedules(orgId: string, trainingId: string, year: number): Promise<any> {
        if (ObjectID.isValid(orgId) && ObjectID.isValid(trainingId)) {
            const result = await this.databaseService.getOne(ProgramModel, { org_id: orgId, training_id: trainingId });
            const mapped = automapper.map(ProgramModel, ProgramDto, result);

            return mapped;
        }

        return null;
    }

    async processRequest(request: ScheduleRequestDto) {
        if (request.added && request.added.length > 0) {
            await this.processAddedSchedules(request.added);
        }

        if (request.updated && request.updated.length > 0) {
            await this.processUpdatedSchedules(request.updated);
        }

        if (request.deleted && request.deleted.length > 0) {
            await this.processDeletedSchedules(request.deleted);
        }
    }

    private async processAddedSchedules(addedSchedules: ScheduleDto[]) {
        for (const addedSchedule of addedSchedules) {
            const filter = {
                org_id: addedSchedule.org_id,
                training_id: addedSchedule.training_id,
                year: new Date(addedSchedule.startDate).getFullYear(),
            };

            const existingProgram = await this.databaseService.getOne(ProgramModel, filter) as ProgramModel;

            if (! existingProgram) {
                const newRecord: ProgramModel = {
                    ...filter,
                    createdAt: new Date(),
                    schedules: [ automapper.map(ScheduleDto, ScheduleModel, addedSchedule) ],
                };

                delete newRecord.deleted;

                await this.databaseService.add(ProgramModel, newRecord);
            } else {
                const existingSchedules = existingProgram.schedules;
                existingSchedules.push(automapper.map(ScheduleDto, ScheduleModel, addedSchedule));

                await this.databaseService.patchOne(ProgramModel, filter, { schedules: existingSchedules });
            }
        }
    }

    private async processUpdatedSchedules(updatedSchedules: ScheduleDto[]) {
        for (const updatedSchedule of updatedSchedules) {
            const filter = {
                'org_id': updatedSchedule.org_id,
                'training_id': updatedSchedule.training_id,
                'year': new Date(updatedSchedule.startDate).getFullYear(),
                'schedules._id': new ObjectID(updatedSchedule._id),
            };

            const update = {
                'updatedAt': new Date(),
                'schedules.$': automapper.map(ScheduleDto, ScheduleModel, updatedSchedule),
            };

            await this.databaseService.patchOne(ProgramModel, filter, update);
        }
    }

    private async processDeletedSchedules(deletedSchedules: ScheduleDto[]) {
        for (const deletedSchedule of deletedSchedules) {
            const filter = {
                org_id: deletedSchedule.org_id,
                training_id: deletedSchedule.training_id,
                year: new Date(deletedSchedule.startDate).getFullYear(),
            };

            const existingProgram = await this.databaseService.getOne(ProgramModel, filter) as ProgramModel;

            const update = {
                updatedAt: new Date(),
                schedules: existingProgram.schedules.splice(existingProgram.schedules.findIndex(schedule => schedule._id.toHexString() === deletedSchedule._id), 1),
            };

            await this.databaseService.patchOne(ProgramModel, filter, update);
        }
    }
}
