import { Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { RoleDefinition } from '../../../domain/model/role-definition.entity';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-role-definitions-panel',
  standalone: true,
  imports: [MatExpansionModule, MatIconModule, TranslateModule],
  templateUrl: './role-definitions-panel.component.html',
  styleUrls: ['']
})
export class RoleDefinitionsPanelComponent {
  @Input() roles: RoleDefinition[] = [];
}
