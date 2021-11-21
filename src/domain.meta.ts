import { DataType } from './enums';
import { isArray, isBool, isString } from './util';

export interface DomainMetaArgs {
  name?: string;
  fields?: Array<FieldMetaArgs>;
}

export interface FieldMetaArgs {
  id?: boolean;
  name?: string;
  dataType?: DataType;
}

export class DomainMeta {
  name: string;

  fields: Map<string, FieldMeta> = new Map<string, FieldMeta>();

  constructor(args?: DomainMetaArgs) {
    const { name, fields } = args || {};

    isString(name) && (this.name = name);
    //isArray(fields) && (this.fields = new Set<FieldMeta>(fields.map(f => new FieldMeta(f))));
  }
}

export class FieldMeta {
  id: boolean;

  name: string;

  dataType: DataType;

  constructor(args?: FieldMetaArgs) {
    const { id, name, dataType } = args || {};

    isBool(id) && (this.id = id);
    isString(name) && (this.name = name);
    isString(dataType) && (this.dataType = dataType);
  }
}
