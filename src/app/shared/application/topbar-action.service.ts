import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

export interface TopbarActionConfig {
  label: string;
  icon?: string;
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class TopbarActionService {
  readonly currentAction = signal<TopbarActionConfig | null>(null);
  readonly customTitle = signal<string | null>(null);
  readonly customSubtitle = signal<string | null>(null);

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
