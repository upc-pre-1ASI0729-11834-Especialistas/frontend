import { Laboratory } from './laboratory.entity';

export interface LaboratoryPagination {
  data: Laboratory[];
  total: number;
  page: number;
  totalPages: number;
}
