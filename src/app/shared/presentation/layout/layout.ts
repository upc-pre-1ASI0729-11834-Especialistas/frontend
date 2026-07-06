import { Component, inject, OnInit, OnDestroy, HostListener, ViewChild } from '@angular/core';
import { Sidebar } from './sidebar/sidebar';
import { Topbar } from './topbar/topbar';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { SystemStatusService } from '../../application/system-status.service';

const MOBILE_BREAKPOINT = 768;

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    Sidebar,
    Topbar,
    RouterModule,
    MatSidenavModule,
    MatIconModule
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css'],
})
export class Layout implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  protected hasSecondarySidebar = false;
  protected isMobile = false;
  protected sidenavOpened = true;

  private readonly systemStatusService = inject(SystemStatusService);
  protected readonly systemStatus = this.systemStatusService.systemStatus;

  private readonly router = inject(Router);

  ngOnInit() {
    this.checkViewport();
    this.checkSidebar(this.router.url);
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkSidebar(this.router.url);
        // Auto-close sidebar on navigation in mobile
        if (this.isMobile) {
          this.sidenavOpened = false;
        }
      });
  }

  ngOnDestroy() {}

  @HostListener('window:resize')
  onResize() {
    this.checkViewport();
  }

  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }

  closeSidenav() {
    this.sidenavOpened = false;
  }

  onSidenavClosed() {
    this.sidenavOpened = false;
  }

  private checkViewport() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

    if (wasMobile && !this.isMobile) {
      // Switched from mobile to desktop: always show sidebar
      this.sidenavOpened = true;
    } else if (!wasMobile && this.isMobile) {
      // Switched from desktop to mobile: hide sidebar
      this.sidenavOpened = false;
    }
  }

  private checkSidebar(url: string) {
    this.hasSecondarySidebar = url.startsWith('/settings');
  }
}
