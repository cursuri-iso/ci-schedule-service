import * as urlAssembler from 'url-assembler';

import { PaginationMetadata } from './paginationMetadata.model';
import { EntityDto } from './entity.dto';

export class PagedList<T> extends Array<T> {
    public totalPages: number;

    get hasPrevious(): boolean {
        return this.years.some(year => year < this.currentYear);
    }

    get hasNext(): boolean {
        return this.years.some(year => year > this.currentYear);
    }

    constructor(items: T[], public years: number[], public currentYear: number) {
        super(...items);
    }

    public static create<T>(items: T[], years: number[], currentYear: number) {
        return new PagedList(items, years, currentYear);
    }
}

export function buildPaginationMetadata<T extends EntityDto>(paginatedList: PagedList<T>, collectionName: string, orgId: string, trainingId: string): PaginationMetadata {
    const result: PaginationMetadata = {
        currentYear: paginatedList.currentYear,
        years: paginatedList.years,
        nextYearLink: '',
        previousYearLink: '',
    };

    let url = urlAssembler()
            .prefix(`/${collectionName}`)
            .template(`/${orgId}/${trainingId}`);

    if (paginatedList.hasNext) {
        url = url
            .param('year', `${paginatedList.currentYear + 1}`, false);

        result.nextYearLink = url.toString();
    }

    if (paginatedList.hasPrevious) {
        url = url
            .param('year', `${paginatedList.currentYear - 1}`, false);

        result.previousYearLink = url.toString();
    }

    return result;
}
