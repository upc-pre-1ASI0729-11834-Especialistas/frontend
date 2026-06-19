import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface WorkspaceResource {
  id: number;
  name: string;
  code: string;
  roleName: string;
}

@Injectable({ providedIn: 'root' })
export class WorkspaceApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.platformProviderApiBaseUrl}/api/v1/workspaces`;

  getMyWorkspaces(): Observable<WorkspaceResource[]> {
    return this.http.get<WorkspaceResource[]>(`${this.baseUrl}/my-workspaces`);
  }

  switchWorkspace(workspaceId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${workspaceId}/switch`, {});
  }

  updateWorkspace(workspaceId: number, name: string): Observable<WorkspaceResource> {
    return this.http.put<WorkspaceResource>(`${this.baseUrl}/${workspaceId}`, { name });
  }
}
