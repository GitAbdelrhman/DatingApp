export interface Pagination {
    currentPage:number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

export class paginationResult<T>{
    result: T;
    pagination: Pagination;
}
