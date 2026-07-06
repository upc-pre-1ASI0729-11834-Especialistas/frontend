import { computed, DestroyRef, inject, Injectable, Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RoleDefinition } from '../domain/model/role-definition.entity';
import { RoleDefinitionsApi } from '../infrastructure/role-definition-api';

@Injectable({ providedIn: 'root' })
export class RoleDefinitionStore {
  private readonly destroyRef = inject(DestroyRef);

  private readonly roleDefinitionsSignal = signal<RoleDefinition[]>([]);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);

  readonly roleDefinitions = this.roleDefinitionsSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly roleDefinitionsCount = computed(() => this.roleDefinitions().length);

  constructor(private readonly roleDefinitionsApi: RoleDefinitionsApi) {}

  getRoleDefinitionById(id: number | null | undefined): Signal<RoleDefinition | undefined> {
    return computed(() => id ? this.roleDefinitions().find(e => e.id === id) : undefined);
  }

  loadRoleDefinitions(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.roleDefinitionsApi.getRoleDefinitions().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: data => {
        this.roleDefinitionsSignal.set(data);
        this.loadingSignal.set(false);
      },
      error: err => this.handleError(err, 'Failed to load role definitions')
    });
  }

  private handleError(error: any, fallback: string): void {
    this.errorSignal.set(error instanceof Error ? error.message : fallback);
    this.loadingSignal.set(false);
  }
}
