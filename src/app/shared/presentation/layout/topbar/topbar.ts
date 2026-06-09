import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-topbar',
  imports: [
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar implements OnInit {
  @Input() showHamburger = false;
  @Output() hamburgerClick = new EventEmitter<void>();

  title = '';
  subtitle = '';

  constructor(
    readonly router: Router,
    readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.updateTitleAndSubtitle();
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.updateTitleAndSubtitle();
      });
  }

  private updateTitleAndSubtitle() {
    let currentRoute = this.route;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }
    const data = currentRoute.snapshot.data;
    this.title = data['title'] ?? '';
    this.subtitle = data['subtitle'] ?? '';
  }
}
