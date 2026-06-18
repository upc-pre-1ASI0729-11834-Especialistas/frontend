import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { HttpClient } from '@angular/common/http';
import { HistoryRecord } from '../domain/model/history-record.entity';
import { HistoryRecordResource, HistoryResponse } from './history-response';
import { HistoryAssembler } from './history-assembler';
import { environment } from '../../../environments/environment';

const historyEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderHistoryEndpointPath}`;

export class HistoryApiEndpoint extends BaseApiEndpoint<
  HistoryRecord,
  HistoryRecordResource,
  HistoryResponse,
  HistoryAssembler
> {
  constructor(http: HttpClient) {
    super(http, historyEndpointUrl, new HistoryAssembler());
  }
}

