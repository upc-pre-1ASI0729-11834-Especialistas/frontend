import { TranslatePipe } from '@ngx-translate/core';
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MetricTypeStore } from '../../../../telemetry/application/metric-type.store';
import { CreateMetricTypeDialog } from '../../components/create-metric-type-dialog/create-metric-type-dialog';
import { MetricType } from '../../../../telemetry/domain/model/metric-type.entity';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { TopbarActionService } from '../../../../shared/application/topbar-action.service';

@Component({
  selector: 'app-metric-types-page',
  standalone: true,
  imports: [CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSlideToggleModule,
    RouterModule, TranslatePipe,],
  templateUrl: './metric-types-page.component.html',
  styleUrls: ['./metric-types-page.component.css']
})
export class MetricTypesPageComponent {
  protected readonly metricTypeStore = inject(MetricTypeStore);
  private readonly dialog = inject(MatDialog);
  private readonly topbarActionService = inject(TopbarActionService);
  private readonly translateService = inject(TranslateService);

  // Filters state
  readonly selectedCategory = signal<string>('all-categories');
  readonly selectedStatus = signal<string>('all-statuses');

  constructor() {
    this.translateService.stream('settings.metricTypes.add')
      .pipe(takeUntilDestroyed())
      .subscribe(label => {
        this.topbarActionService.setAction({
          label: label || 'Add Metric Type',
          icon: 'add',
          id: 'add-metric-type-action'
        });
      });

    this.topbarActionService.actionClicked$
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.openCreateMetricTypeDialog();
      });
  }

  // Dynamic filter options based on categories
  readonly categories = ['ENVIRONMENTAL', 'SAFETY', 'EQUIPMENT'];

  // Filtered metric type list
  readonly filteredMetricTypes = computed(() => {
    let list = this.metricTypeStore.metricTypes() as MetricType[];
    const category = this.selectedCategory();
    const status = this.selectedStatus();

    if (category && category !== 'all-categories') {
      list = list.filter((m: MetricType) => m.category === category);
    }
    if (status && status !== 'all-statuses') {
      const activeOnly = status === 'active';
      list = list.filter((m: MetricType) => m.active === activeOnly);
    }
    return list;
  });

  // Count metrics
  readonly totalCount = computed(() => (this.metricTypeStore.metricTypes() as MetricType[]).length);
  readonly activeCount = computed(() => (this.metricTypeStore.metricTypes() as MetricType[]).filter((m: MetricType) => m.active).length);
  readonly inactiveCount = computed(() => (this.metricTypeStore.metricTypes() as MetricType[]).filter((m: MetricType) => !m.active).length);

  // Dialog actions
  openCreateMetricTypeDialog(metricType?: MetricType): void {
    const dialogRef = this.dialog.open(CreateMetricTypeDialog, {
      position: { right: '0', top: '0' },
      height: '100vh',
      width: '400px',
      panelClass: 'side-sheet-dialog',
      data: { metricType }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (metricType) {
          const updated = new MetricType({
            id: metricType.id,
            key: metricType.key,
            displayName: result.displayName,
            unit: result.unit,
            icon: result.icon,
            category: result.category,
            active: result.active
          });
          this.metricTypeStore.update(updated);
        } else {
          const newMetricType = new MetricType({
            id: 0,
            key: result.key,
            displayName: result.displayName,
            unit: result.unit,
            icon: result.icon,
            category: result.category,
            active: result.active !== undefined ? result.active : true
          });
          this.metricTypeStore.create(newMetricType);
        }
      }
    });
  }

  toggleActive(metricType: MetricType): void {
    const updated = new MetricType({
      id: metricType.id,
      key: metricType.key,
      displayName: metricType.displayName,
      unit: metricType.unit,
      icon: metricType.icon,
      category: metricType.category,
      active: !metricType.active
    });
    this.metricTypeStore.update(updated);
  }
}
