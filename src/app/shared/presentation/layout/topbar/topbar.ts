import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-topbar',
  imports: [
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar implements OnInit {
   title = '';
  subtitle = '';

  constructor(
    readonly router: Router,
    readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let currentRoute = this.route;

          // bajar hasta la ruta hija activa
          while (currentRoute.firstChild) {
            currentRoute = currentRoute.firstChild;
          }

          return currentRoute.snapshot.data;
        })
      )
      .subscribe(data => {
        this.title = data['title'] ?? '';
        this.subtitle = data['subtitle'] ?? '';
      });
  }
}
