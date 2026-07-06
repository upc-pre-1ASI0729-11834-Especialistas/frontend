import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-laboratories-toolbar',
  imports: [
    RouterLink,
    MatSelect,
    MatOption,
    MatFormField,
    MatLabel,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatButton,
    MatIcon,
    TranslatePipe
  ],
  templateUrl: './laboratories-toolbar.component.html',
  styleUrls: ['./laboratories-toolbar.component.css']
})
export class LaboratoriesToolbarComponent {
  totalCount = input.required<number>();
  locations = input.required<string[]>();
  viewMode = input.required<'grid' | 'list'>();

  statusChange = output<string>();
  locationChange = output<string>();
  viewModeChange = output<'grid' | 'list'>();
}
