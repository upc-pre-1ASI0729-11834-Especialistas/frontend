import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class MetricType implements BaseEntity {
  id: number;
  key: string;
  displayName: string;
  unit: string;
  icon: string;
  category: string;
  active: boolean;

  constructor(data: {
    id: number;
    key: string;
    displayName: string;
    unit: string;
    icon: string;
    category: string;
    active: boolean;
  }) {
    this.id = data.id;
    this.key = data.key;
    this.displayName = data.displayName;
    this.unit = data.unit;
    this.icon = data.icon;
    this.category = data.category;
    this.active = data.active;
  }
}
