import { Component, OnInit, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { UpperCasePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcher } from '../../components/language-switcher/language-switcher';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TopbarActionService, TopbarActionConfig } from '../../../application/topbar-action.service';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge.component';

@Component({
  selector: 'app-topbar',
  imports: [
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    TranslateModule,
    LanguageSwitcher,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    UpperCasePipe,
    StatusBadgeComponent
  ],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.css'],
})
export class Topbar implements OnInit {
  @Input() showHamburger = false;
  @Output() hamburgerClick = new EventEmitter<void>();

  private readonly routeTitle = signal('');
  private readonly routeSubtitle = signal('');

  readonly title = computed(() => this.topbarActionService.customTitle() ?? this.routeTitle());
  readonly subtitle = computed(() => this.topbarActionService.customSubtitle() ?? this.routeSubtitle());
  readonly action = computed(() => this.topbarActionService.currentAction());
  readonly actions = computed(() => this.topbarActionService.customActions());
  readonly breadcrumbs = computed(() => this.topbarActionService.customBreadcrumbs());

  constructor(
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly topbarActionService: TopbarActionService
  ) {}

  ngOnInit() {
    this.updateTitleAndSubtitle();
    
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart)
      )
      .subscribe(() => {
        this.topbarActionService.clearCustomTitleAndSubtitle();
        this.topbarActionService.clearAction();
        this.topbarActionService.clearActions();
        this.topbarActionService.clearBreadcrumbs();
        this.topbarActionService.clearBadge();
      });

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.updateTitleAndSubtitle();
      });
  }

  onActionClick() {
    this.topbarActionService.triggerClick();
  }

  private updateTitleAndSubtitle() {
    let currentRoute = this.route;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }
    const data = currentRoute.snapshot.data;
    this.routeTitle.set(data['title'] ?? '');
    this.routeSubtitle.set(data['subtitle'] ?? '');
    const routeAction = data['topbarAction'] ?? null;
    if (routeAction) {
      this.topbarActionService.setAction(routeAction);
    }
  }
}
