import { Component, input, output, computed, inject, signal, effect } from '@angular/core';
import { TemperatureReading } from '../../../domain/model/temperature-reading.entity';
import { MetricType } from '../../../domain/model/metric-type.entity';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LaboratoryStore } from '../../../application/laboratory.store';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexGrid,
  ApexYAxis,
  ApexFill,
  ApexLegend
} from 'ng-apexcharts';
import { CardComponent } from '../../../../shared/presentation/components/card/card.component';
import { MatIcon } from '@angular/material/icon';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  yaxis: ApexYAxis;
  fill: ApexFill;
  legend: ApexLegend;
  colors: string[];
};

@Component({
  selector: 'app-temperature-chart',
  imports: [CardComponent, MatButtonToggleGroup, MatButtonToggle, NgApexchartsModule, MatIcon, MatSelectModule, MatFormFieldModule],
  templateUrl: './temperature-chart.component.html',
  styleUrl: './temperature-chart.component.css',
})
export class TemperatureChartComponent {
  readings = input.required<TemperatureReading[]>();
  metricType = input<MetricType>();
  selectedPeriod = input<string>('30d');
  periodChanged = output<string>();

  periods = ['24h', '7d', '30d'];

  protected readonly laboratoryStore = inject(LaboratoryStore);
  selectedLabIds = signal<number[]>([]);
  private initialized = false;

  constructor() {
    this.initializeMonitoredLabs();

    effect(() => {
      const labs = this.laboratoryStore.laboratories();
      if (labs.length > 0 && !this.initialized) {
        this.initializeMonitoredLabs();
      }
    });
  }

  private initializeMonitoredLabs(): void {
    const labs = this.laboratoryStore.laboratories();
    if (labs.length > 0 && !this.initialized) {
      this.initialized = true;
      const stored = localStorage.getItem('safelab_monitored_labs');
      if (stored) {
        try {
          const ids = JSON.parse(stored) as number[];
          const validIds = ids.filter(id => labs.some(l => l.id === id));
          if (validIds.length > 0) {
            this.selectedLabIds.set(validIds);
            return;
          }
        } catch (e) {
          // ignore
        }
      }
      
      if (labs.length <= 3) {
        this.selectedLabIds.set(labs.map(l => l.id));
      } else {
        this.selectedLabIds.set(labs.slice(0, 2).map(l => l.id));
      }
    }
  }

  onLabSelectionChange(ids: number[]): void {
    this.selectedLabIds.set(ids);
    localStorage.setItem('safelab_monitored_labs', JSON.stringify(ids));
  }

  chartOptions = computed<Partial<ChartOptions>>(() => {
    const data = this.readings();
    const allLabs = this.laboratoryStore.laboratories();
    const selectedIds = this.selectedLabIds();

    const series = allLabs
      .filter(lab => selectedIds.includes(lab.id))
      .map((lab) => {
        return {
          name: lab.name,
          data: data.map(r => {
            const valMap = r.values;
            if (valMap && valMap[lab.id.toString()] !== undefined) {
              return valMap[lab.id.toString()];
            }
            return 20.0;
          })
        };
      });

    const colorPalette = [
      'var(--mat-sys-primary)',
      'var(--mat-sys-tertiary)',
      'var(--mat-sys-error)',
      '#10B981',
      '#F59E0B',
      '#6366F1'
    ];
    const colors = series.map((_, i) => colorPalette[i % colorPalette.length]);

    return {
      series,
      colors,
      chart: {
        type: 'area',
        height: '100%',
        width: '100%',
        fontFamily: 'Inter, sans-serif',
        toolbar: { show: false },
        selection: { enabled: false },
        zoom: { enabled: false },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        },
        background: 'transparent'
      },
      states: {
        hover: { filter: { type: 'none' } },
        active: { filter: { type: 'none' } }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0,
          stops: [0, 100]
        }
      },
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: 2.5
      },
      xaxis: {
        categories: data.map(r => r.date),
        labels: {
          style: {
            colors: 'var(--mat-sys-on-surface-variant)',
            fontSize: '12px'
          },
          rotate: -90,
          rotateAlways: data.length > 8,
          hideOverlappingLabels: false,
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false }
      },
      yaxis: {
        labels: {
          style: {
            colors: 'var(--mat-sys-on-surface-variant)',
            fontSize: '12px'
          },
          formatter: (value) => `${Math.round(value)} ${this.metricType()?.unit || ''}`
        }
      },
      grid: {
        borderColor: 'var(--mat-sys-outline-variant)',
        strokeDashArray: 0,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
        padding: { top: 0, right: 24, bottom: 0, left: 10 }
      },
      tooltip: {
        enabled: false
      },
      legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        labels: { colors: 'var(--mat-sys-on-surface-variant)' },
        markers: {
          size: 6,
          shape: 'circle'
        },
        itemMargin: {
          horizontal: 12,
          vertical: 8
        },
        onItemClick: { toggleDataSeries: false },
        onItemHover: { highlightDataSeries: false }
      }
    };
  });

  onPeriodClick(period: string): void {
    this.periodChanged.emit(period);
  }
}
