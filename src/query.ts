/**
 * Represents a db query.
 */
export class Query {
  readonly pageNo: number = 1;
  readonly pageSize: number = 10;
  readonly sortBy: string = null;
  readonly sortDir: 'asc' | 'desc' = 'asc';
  readonly filters: Array<QueryFilter> = [];

  constructor(args?: any) {
    if (!args) {
      return;
    }

    const { pageNo, pageSize, sortBy, sortDir, filters } = args;

    typeof pageNo === 'number' && (this.pageNo = pageNo);
    typeof pageSize === 'number' && (this.pageSize = pageSize);
    typeof sortBy === 'string' && (this.sortBy = sortBy);
    typeof sortDir === 'string' && (this.sortDir = <'asc' | 'desc'>sortDir);
    Array.isArray(filters) &&
      (this.filters = filters.map(
        filter => new QueryFilter(filter.field, filter.operator, filter.value)
      ));
  }
}

export class QueryFilter {
  field: string = null;
  operator: QueryOperator = null;
  value: any = null;

  constructor(field: string, operator: QueryOperator, value: any) {
    this.field = field;
    this.operator = operator;
    this.value = value;
  }
}

export enum QueryOperator {
  EQUALS = '=',
  NOT_EQUALS = '!=',
  LESS = '<',
  GREATER = '>',
  LESS_OR_EQUAL = '<=',
  GREATER_OR_EQUAL = '>=',
  IN = 'in',
  NOT_IN = '!in'
}
