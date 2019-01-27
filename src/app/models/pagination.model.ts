export class PaginationModel {
    private currYear: number;

    constructor() {
        this.currYear = new Date().getFullYear();
    }

    get year(): number {
        return this.currYear;
    }

    set year(value: number) {
        const year: number = Number.parseInt(value.toString(), 10);

        if (year) {
            this.currYear = year;
        } else {
            this.currYear = new Date().getFullYear();
        }
    }
}
