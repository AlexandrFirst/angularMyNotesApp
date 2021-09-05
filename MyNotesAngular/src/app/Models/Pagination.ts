import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";

export interface Pagination {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

export class PaginatedResult<T> {
    result: T;
    pagination: Pagination;
}

export class InputParamType<T>{
    name: string;
    value: T;
}

export function ExecutePaginatedQuery<T>(client: HttpClient, query: string, page?: number, pageSize?: number, ...inputParams: InputParamType<any>[]) {
    const paginatedResult: PaginatedResult<T[]> = new PaginatedResult<T[]>();
    let params = new HttpParams();

    if (page != null && pageSize != null) {
        params = params.append('pageNumber', page.toString());
        params = params.append('pageSize', pageSize.toString());
    }

    inputParams.forEach(element => {
        if (element.value != null) {
            params = params.append(element.name, element.value);
        }
    });

    return client.get<T[]>(query, { observe: 'response', params }).pipe(
        map(response => {
            paginatedResult.result = response.body;
            if (response.headers.get('Pagination') != null) {
                paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
            }
            return paginatedResult;
        })
    );
}
