import { PipeTransform, ArgumentMetadata, Injectable } from '@nestjs/common';

import { PaginationModel } from '../app/models/pagination.model';

@Injectable()
export class PaginationPipe implements PipeTransform<any> {
    transform(value: any, metadata: ArgumentMetadata) {
        const result: PaginationModel = new PaginationModel();

        if (value.year) {
            result.year = value.year;
        }

        return result;
    }
}
