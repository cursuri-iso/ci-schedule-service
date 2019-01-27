import { Column } from 'typeorm';
import { IsMongoId, IsDate, IsInt, IsBoolean, Min, Max, IsNumber, IsPositive, IsString, Length, IsOptional } from 'class-validator';
import { EntityModel } from './entity.model';

export class ScheduleModel extends EntityModel {
    @IsMongoId()
    // tslint:disable-next-line:variable-name
    location_id: string;

    @IsDate()
    startDate: Date;

    @IsInt()
    @Min(1)
    @Max(15)
    duration: number;

    @IsBoolean()
    certified: boolean;

    @IsBoolean()
    vatFree: boolean;

    @IsNumber()
    @IsPositive({ message: 'Pretul trebuie sa fie un numar pozitiv' })
    @Max(15000, { message: 'Pretul maxim nu poate depasi 15.000' })
    price: number;

    @IsString({ message: 'Valuta este obligatorie' })
    @Length(3, 3, { message: 'Valuta trebuie sa aiba 3 caractere' })
    priceCurr: string;

    @IsString()
    @IsOptional()
    @Length(0, 1000)
    remark: string;
}
