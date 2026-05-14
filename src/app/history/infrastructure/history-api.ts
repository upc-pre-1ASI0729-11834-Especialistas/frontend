import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistoryRecord } from '../domain/model/history-record.entity';
import { HistoryApiEndpoint } from './history-api-endpoint';

@Injectable({ providedIn: 'root' })
export class HistoryApi extends BaseApi {
  private readonly historyEndpoint: HistoryApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.historyEndpoint = new HistoryApiEndpoint(http);
  }

  getHistory(): Observable<HistoryRecord[]> {
    return this.historyEndpoint.getAll();
  }

  getHistoryRecord(id: number): Observable<HistoryRecord> {
    return this.historyEndpoint.getById(id);
  }

  createHistoryRecord(record: HistoryRecord): Observable<HistoryRecord> {
    return this.historyEndpoint.create(record);
  }

  updateHistoryRecord(record: HistoryRecord): Observable<HistoryRecord> {
    return this.historyEndpoint.update(record, record.id);
  }

  deleteHistoryRecord(id: number): Observable<void> {
    return this.historyEndpoint.delete(id);
  }
}

