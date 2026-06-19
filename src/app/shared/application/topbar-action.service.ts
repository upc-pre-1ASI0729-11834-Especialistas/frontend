import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

export interface BreadcrumbConfig {
  label: string;
  url?: string;
}

export interface TopbarActionConfig {
  label: string;
  icon?: string;
  id: string;
  styleClass?: string;
  routerLink?: any[];
  onClick?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class TopbarActionService {
  readonly currentAction = signal<TopbarActionConfig | null>(null);
  readonly customActions = signal<TopbarActionConfig[] | null>(null);
  readonly customBreadcrumbs = signal<BreadcrumbConfig[] | null>(null);
  readonly customTitle = signal<string | null>(null);
  readonly customSubtitle = signal<string | null>(null);
  readonly customBadge = signal<{ severity: string; label: string } | null>(null);

  private readonly actionClickedSource = new Subject<void>();
  readonly actionClicked$ = this.actionClickedSource.asObservable();

  triggerClick(): void {
    this.actionClickedSource.next();
  }

  setAction(action: TopbarActionConfig | null): void {
    this.currentAction.set(action);
  }

  clearAction(): void {
    this.currentAction.set(null);
  }

  setActions(actions: TopbarActionConfig[] | null): void {
    this.customActions.set(actions);
  }

  clearActions(): void {
    this.customActions.set(null);
  }

  setBreadcrumbs(breadcrumbs: BreadcrumbConfig[] | null): void {
    this.customBreadcrumbs.set(breadcrumbs);
  }

  clearBreadcrumbs(): void {
    this.customBreadcrumbs.set(null);
  }

  setBadge(badge: { severity: string; label: string } | null): void {
    this.customBadge.set(badge);
  }

  clearBadge(): void {
    this.customBadge.set(null);
  }

  setTitle(title: string | null): void {
    this.customTitle.set(title);
  }

  setSubtitle(subtitle: string | null): void {
    this.customSubtitle.set(subtitle);
  }

  clearCustomTitleAndSubtitle(): void {
    this.customTitle.set(null);
    this.customSubtitle.set(null);
  }
}
