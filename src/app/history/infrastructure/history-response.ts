import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface HistoryRecordResource extends BaseResource {
  id: number;
  name: string;
  description: string;
  occurredAt: string;
  lab: string;
  eventType: string;
  severity: string;
  status: string;
}

export interface HistoryResponse extends BaseResponse {
  history: HistoryRecordResource[];
}

