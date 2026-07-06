import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ComplianceReport } from '../domain/model/compliance-report.entity';

@Injectable({
  providedIn: 'root'
})
export class ComplianceReportApi {
  constructor(private readonly http: HttpClient) {}

  getReportsByLabId(labId: number): Observable<ComplianceReport[]> {
    const url = `${environment.platformProviderApiBaseUrl}${environment.platformProviderLabsEndpointPath}/${labId}/compliance-reports`;
    return this.http.get<ComplianceReport[]>(url);
  }
}
