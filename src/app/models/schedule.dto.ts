import { IsMongoId, IsDate, IsInt, Min, Max, IsBoolean, IsNumber, IsPositive, IsString, Length, IsOptional, IsArray, ArrayNotEmpty } from 'class-validator';
import { EntityDto } from './entity.dto';

export class ScheduleDto extends EntityDto {
    @IsMongoId()
    // tslint:disable-next-line:variable-name
    _id?: string;

    @IsMongoId()
    // tslint:disable-next-line:variable-name
    org_id: string;

    @IsMongoId()
    // tslint:disable-next-line:variable-name
    training_id: string;

    @IsMongoId()
    // tslint:disable-next-line:variable-name
    location_id: string;

    @ArrayNotEmpty({ message: 'Selectati cel putin un standard' })
    standards: string[];

    @ArrayNotEmpty({ message: 'Selectati cel putin un domeniu' })
    domains: string[];

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

    @IsArray()
    tags: string[];

    @IsString()
    @IsOptional()
    @Length(0, 1000)
    remark?: string;
}
