import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Laboratory } from '../domain/model/laboratory.entity';
import { LaboratoryPagination } from '../domain/model/laboratory-pagination';
import { LaboratoryResource, LaboratoryResponse } from './laboratory-response';
import { LaboratoryAssembler } from './laboratory-assembler';
import { Observable, catchError, map } from 'rxjs';

export class LaboratoryApiEndpoint extends BaseApiEndpoint<
  Laboratory,
  LaboratoryResource,
  LaboratoryResponse,
  LaboratoryAssembler
> {
  constructor(http: HttpClient, endpointUrl: string) {
    super(http, endpointUrl, new LaboratoryAssembler());
  }

  getPaginated(
    page: number,
    limit: number,
    status?: string,
    location?: string,
    search?: string
  ): Observable<LaboratoryPagination> {
    let params = new HttpParams()
      .set('_page', page.toString())
      .set('_limit', limit.toString());

    if (status && status !== 'All') {
      params = params.set('overallStatus', status);
    }
    if (location && location !== 'All') {
      params = params.set('building', location);
    }
    if (search) {
      params = params.set('name_like', search);
    }

    return this.http.get<LaboratoryResource[]>(this.endpointUrl, { params, observe: 'response' }).pipe(
      map(response => {
        const totalCount = parseInt(response.headers.get('X-Total-Count') || '0', 10);
        const resources = response.body || [];
        return {
          data: resources.map(r => this.assembler.toEntityFromResource(r)),
          total: totalCount,
          page: page,
          totalPages: Math.ceil(totalCount / limit)
        } as LaboratoryPagination;
      }),
      catchError(this.handleError('Failed to fetch paginated laboratories'))
    );
  }
}
