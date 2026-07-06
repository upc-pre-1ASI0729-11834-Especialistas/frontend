import { TranslatePipe } from '@ngx-translate/core';
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
  imports: [CardComponent, MatButtonToggleGroup, MatButtonToggle, NgApexchartsModule, MatIcon, MatSelectModule, MatFormFieldModule, TranslatePipe,],
  templateUrl: './temperature-chart.component.html',
  styleUrls: ['./temperature-chart.component.css'],
})
export class TemperatureChartComponent {
  readings = input.required<TemperatureReading[]>();
  metricType = input<MetricType>();
  selectedPeriod = input<string>('2m');
  periodChanged = output<string>();

  periods = ['2m', '24h', '7d', '30d'];

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

  readonly chart: ApexChart = {
    type: 'area',
    height: '100%',
    width: '100%',
    fontFamily: 'Inter, sans-serif',
    toolbar: { show: false },
    selection: { enabled: false },
    zoom: { enabled: false },
    animations: {
      enabled: false
    },
    background: 'transparent'
  };

  readonly stroke: ApexStroke = {
    curve: 'smooth',
    width: 2.5
  };

  readonly dataLabels: ApexDataLabels = {
    enabled: false
  };

  readonly grid: ApexGrid = {
    borderColor: 'var(--mat-sys-outline-variant)',
    strokeDashArray: 0,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
    padding: { top: 0, right: 24, bottom: 0, left: 10 }
  };

  readonly fill: ApexFill = {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0,
      stops: [0, 100]
    }
  };

  readonly tooltip: ApexTooltip = {
    enabled: false
  };

  readonly legend: ApexLegend = {
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
  };

  readonly yaxis = computed<ApexYAxis>(() => {
    const data = this.readings();
    const allLabs = this.laboratoryStore.laboratories();
    const selectedIds = this.selectedLabIds();

    let vals: number[] = [];
    for (const r of data) {
      for (const id of selectedIds) {
        if (r.values && r.values[id.toString()] !== undefined) {
          vals.push(r.values[id.toString()]);
        }
      }
    }

    // Default bounds based on metric key or fallback
    const metric = this.metricType();
    let defaultMin = 15;
    let defaultMax = 30;
    if (metric) {
      if (metric.key === 'humidity') {
        defaultMin = 20;
        defaultMax = 80;
      } else if (metric.key === 'co2') {
        defaultMin = 400;
        defaultMax = 1000;
      }
    }

    let yMin = vals.length > 0 ? Math.min(...vals) : defaultMin;
    let yMax = vals.length > 0 ? Math.max(...vals) : defaultMax;

    if (yMin === yMax) {
      // If constant data, pad slightly
      yMin -= 1;
      yMax += 1;
    }

    const diff = yMax - yMin;
    let decimals = 1;
    if (diff < 1) {
      decimals = 2;
    } else if (diff > 50) {
      decimals = 0;
    }

    return {
      tickAmount: 5,
      min: yMin,
      max: yMax,
      labels: {
        style: {
          colors: 'var(--mat-sys-on-surface-variant)',
          fontSize: '12px'
        },
        formatter: (value) => `${value.toFixed(decimals)} ${metric?.unit || ''}`
      }
    };
  });

  readonly series = computed(() => {
    const data = this.readings();
    const allLabs = this.laboratoryStore.laboratories();
    const selectedIds = this.selectedLabIds();

    return allLabs
      .filter(lab => selectedIds.includes(lab.id))
      .map((lab) => {
        return {
          name: lab.name,
          data: data.map(r => {
            const valMap = r.values;
            if (valMap && valMap[lab.id.toString()] !== undefined) {
              return valMap[lab.id.toString()];
            }
            return null;
          })
        };
      });
  });

  readonly colors = computed(() => {
    const seriesLength = this.series().length;
    const colorPalette = [
      'var(--mat-sys-primary)',
      'var(--mat-sys-tertiary)',
      'var(--mat-sys-error)',
      '#10B981',
      '#F59E0B',
      '#6366F1'
    ];
    return Array.from({ length: seriesLength }, (_, i) => colorPalette[i % colorPalette.length]);
  });

  readonly xaxis = computed<ApexXAxis>(() => {
    const data = this.readings();
    return {
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
    };
  });

  onPeriodClick(period: string): void {
    this.periodChanged.emit(period);
  }
}
