/**
 * Represents the cloud db query result.
 */
export class QueryResult<T> {
  readonly pageNo: number = 1;
  readonly pageSize: number = 10;
  readonly total: number = 0;
  readonly result: Array<T> = [];

  constructor(args?: {
    pageNo?: number;
    pageSize?: number;
    total?: number;
    result?: Array<T>;
  }) {
    if (!args) {
      return;
    }

    const { pageNo, pageSize, total, result } = args;

    typeof pageNo === 'number' && (this.pageNo = pageNo);
    typeof pageSize === 'number' && (this.pageSize = pageSize);
    typeof total === 'number' && (this.total = total);
    Array.isArray(result) && (this.result = result);
  }
}
