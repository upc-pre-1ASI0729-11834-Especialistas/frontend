import { Component, inject, OnInit } from '@angular/core';
import {Sidebar} from './sidebar/sidebar';
import {Topbar} from './topbar/topbar';
import {RouterModule, Router, NavigationEnd} from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  imports: [
    Sidebar,
    Topbar,
    RouterModule,
    MatSidenavModule
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnInit {
  protected hasSecondarySidebar = false;
  private readonly router = inject(Router);

  ngOnInit() {
    this.checkSidebar(this.router.url);
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkSidebar(this.router.url);
      });
  }

  private checkSidebar(url: string) {
    this.hasSecondarySidebar = url.startsWith('/settings');
  }
}
