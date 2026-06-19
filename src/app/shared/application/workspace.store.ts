import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WorkspaceApiService, WorkspaceResource } from '../infrastructure/workspace-api.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WorkspaceStore {
  private readonly destroyRef = inject(DestroyRef);
  private readonly workspaceApi = inject(WorkspaceApiService);

  private readonly workspacesSignal = signal<WorkspaceResource[]>([]);
  private readonly activeWorkspaceIdSignal = signal<number | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly workspaces = this.workspacesSignal.asReadonly();
  readonly activeWorkspaceId = this.activeWorkspaceIdSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly activeWorkspace = computed(() => {
    const id = this.activeWorkspaceId();
    const list = this.workspaces();
    return list.find(w => w.id === id) || (list.length > 0 ? list[0] : null);
  });

  constructor() {
    const storedId = localStorage.getItem('activeWorkspaceId');
    if (storedId) {
      this.activeWorkspaceIdSignal.set(Number(storedId));
    }
    this.loadWorkspaces();
  }

  loadWorkspaces(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.workspaceApi.getMyWorkspaces().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: list => {
        this.workspacesSignal.set(list);
        this.loadingSignal.set(false);
        // If there's no active workspace ID set or it's not in the list, set to first workspace
        const currentId = this.activeWorkspaceId();
        const found = list.some(w => w.id === currentId);
        if (list.length > 0 && (!currentId || !found)) {
          this.activeWorkspaceIdSignal.set(list[0].id);
          localStorage.setItem('activeWorkspaceId', String(list[0].id));
        }
      },
      error: err => {
        console.error('Failed to load workspaces:', err);
        this.errorSignal.set('Failed to load workspaces');
        this.loadingSignal.set(false);
      }
    });
  }

  switchWorkspace(workspaceId: number): Observable<void> {
    this.loadingSignal.set(true);
    return this.workspaceApi.switchWorkspace(workspaceId).pipe(
      tap({
        next: () => {
          this.activeWorkspaceIdSignal.set(workspaceId);
          localStorage.setItem('activeWorkspaceId', String(workspaceId));
          this.loadingSignal.set(false);
          // Reload the page to reset all stores and re-fetch clean data under the new workspace context
          window.location.reload();
        },
        error: err => {
          console.error('Failed to switch workspace:', err);
          this.errorSignal.set('Failed to switch workspace');
          this.loadingSignal.set(false);
        }
      })
    );
  }

  updateWorkspaceName(workspaceId: number, name: string): Observable<WorkspaceResource> {
    this.loadingSignal.set(true);
    return this.workspaceApi.updateWorkspace(workspaceId, name).pipe(
      tap({
        next: updated => {
          this.workspacesSignal.update(list =>
            list.map(w => w.id === workspaceId ? { ...w, name: updated.name } : w)
          );
          this.loadingSignal.set(false);
        },
        error: err => {
          console.error('Failed to update workspace name:', err);
          this.errorSignal.set('Failed to update workspace name');
          this.loadingSignal.set(false);
        }
      })
    );
  }
}
