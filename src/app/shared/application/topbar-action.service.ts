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
}
