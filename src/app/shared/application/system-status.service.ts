import { Injectable, signal, inject, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timer } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class SystemStatusService {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  private readonly systemStatusSignal = signal<'CONNECTED' | 'DISCONNECTED' | 'SERVER_ERROR'>('CONNECTED');
  readonly systemStatus = this.systemStatusSignal.asReadonly();

  private readonly endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderSystemStatusEndpointPath}`;

  constructor() {
    this.startPolling();
  }

  private startPolling(): void {
    timer(0, 8000)
      .pipe(
        switchMap(() => 
          this.http.get<{ status: string }>(this.endpointUrl).pipe(
            map(response => response.status === 'CONNECTED' ? 'CONNECTED' as const : 'DISCONNECTED' as const),
            catchError(() => of('SERVER_ERROR' as const))
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(status => {
        this.systemStatusSignal.set(status);
      });
  }
}
