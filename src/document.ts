import { field } from './decorators';
import { DataType } from './enums';
import { KeyValuePair } from './contracts';
import { DOMAIN_META_KEY } from './constants';
import { DomainMeta } from './domain.meta';

export type DocumentConstructor<T extends Document> = new (...args: any[]) => T;

/**
 * The base class for all documents.
 */
export class Document {
  /**
   * The unique id.
   */
  @field()
  id: string = null;

  /**
   * The created date.
   */
  @field({ dataType: DataType.Date })
  createdDate: Date = null;

  /**
   * The created by user id.
   */
  @field()
  createdById: string = null;

  /**
   * Last modified date.
   */
  @field({ dataType: DataType.Date })
  lastModifiedDate: Date = null;

  /**
   * The last modified user id.
   */
  @field()
  lastModifiedById: string = null;

  get meta(): DomainMeta {
    return this.constructor[DOMAIN_META_KEY];
  }

  constructor(args?: KeyValuePair) {
    if (!args) {
      return;
    }

    this.in(args);
  }

  fieldMeta(field: string) {
    return this.meta.fields.get(field);
  }

  setFieldValue(key: string, value: any) {
    if (!this.meta.fields.has(key)) {
      return;
    }

    const fieldMeta = this.fieldMeta(key),
      { dataType } = fieldMeta;

    switch (dataType) {
      case DataType.Date:
        break;

      case DataType.Array:
        break;

      default:
        this[key] = value;
    }
  }

  getFieldValue(key: string) {
    const fieldMeta = this.fieldMeta(key),
      { dataType } = fieldMeta;

    switch (dataType) {
      case DataType.Date:
        break;

      case DataType.Array:
        break;

      default:
        return this[key];
    }
  }

  in(state: KeyValuePair) {
    for (const [key, value] of Object.entries(state)) {
      this.setFieldValue(key, value);
    }
  }

  out(): KeyValuePair {
    const result: any = {};
    this.meta.fields.forEach(({ name }) => {
      result[name] = this.getFieldValue(name);
    });
    return result;
  }
}
