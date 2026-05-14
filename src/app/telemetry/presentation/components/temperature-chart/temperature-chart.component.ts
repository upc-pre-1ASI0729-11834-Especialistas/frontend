import { Component, input, output, computed } from '@angular/core';
import { TemperatureReading } from '../../../domain/model/temperature-reading.entity';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { NgApexchartsModule } from 'ng-apexcharts';
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
  imports: [CardComponent, MatButtonToggleGroup, MatButtonToggle, NgApexchartsModule],
  templateUrl: './temperature-chart.component.html',
  styleUrl: './temperature-chart.component.css',
})
export class TemperatureChartComponent {
  readings = input.required<TemperatureReading[]>();
  selectedPeriod = input<string>('30d');
  periodChanged = output<string>();

  periods = ['24h', '7d', '30d'];

  chartOptions = computed<Partial<ChartOptions>>(() => {
    const data = this.readings();

    return {
      series: [
        {
          name: 'Lab 01',
          data: data.map(r => r.lab01Value)
        },
        {
          name: 'Lab 02',
          data: data.map(r => r.lab02Value)
        }
      ],
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
      colors: ['var(--mat-sys-primary)', 'var(--mat-sys-tertiary)'],
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
          formatter: (value) => `${Math.round(value)}°C`
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
