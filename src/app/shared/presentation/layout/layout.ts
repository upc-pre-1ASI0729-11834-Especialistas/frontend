import { Component } from '@angular/core';
import {Sidebar} from './sidebar/sidebar';
import {Topbar} from './topbar/topbar';
import {RouterModule} from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';

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
export class Layout {

}
