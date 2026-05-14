import { computed, DestroyRef, inject, Injectable, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SecurityAccess } from '../domain/model/security-access.entity';
import { SecurityAccessesApi } from '../infrastructure/security-access-api';

@Injectable({ providedIn: 'root' })
export class SecurityAccessStore {
  private readonly destroyRef = inject(DestroyRef);

  private readonly securityAccessesSignal = signal<SecurityAccess[]>([]);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);

  readonly securityAccesses = this.securityAccessesSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly securityAccessesCount = computed(() => this.securityAccesses().length);

  constructor(private readonly securityAccessesApi: SecurityAccessesApi) {
    this.loadSecurityAccesses();
  }

  getSecurityAccessById(id: number | null | undefined): Signal<SecurityAccess | undefined> {
    return computed(() => id ? this.securityAccesses().find(e => e.id === id) : undefined);
  }

  private loadSecurityAccesses(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.securityAccessesApi.getSecurityAccesses().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: data => {
        this.securityAccessesSignal.set(data);
        this.loadingSignal.set(false);
      },
      error: err => this.handleError(err, 'Failed to load security accesses')
    });
  }

  private handleError(error: any, fallback: string): void {
    this.errorSignal.set(error instanceof Error ? error.message : fallback);
    this.loadingSignal.set(false);
  }
}
