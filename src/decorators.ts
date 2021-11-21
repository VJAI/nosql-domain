import { DOMAIN_META_KEY } from './constants';
import { DomainMeta } from './domain.meta';
import { DataType } from './enums';
import { isObject, isString } from './util';

export interface FieldOptions {
  name?: string;
  dataType?: DataType;
  id?: boolean;
}

export function document(name?: string): ClassDecorator {
  return (target: any) => {
    setMeta(
      target,
      Object.assign(getMeta(target), { name: name || target.name })
    );
  };
}

export function field(
  nameOrOptions?: string | FieldOptions,
  dataType?: DataType
): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    const metadata = getMeta(target.constructor),
      { fields } = metadata;

    let name;

    if (isString(nameOrOptions)) {
      name = nameOrOptions;
    } else if (isObject(nameOrOptions)) {
      name = (<FieldOptions>nameOrOptions).name;
    }

    fields.add({ name: name || <string>propertyKey, dataType });
    setMeta(target.constructor, metadata);
  };
}

function getMeta(target: Function) {
  return target[DOMAIN_META_KEY] || new DomainMeta();
}

function setMeta(target: Function, meta: DomainMeta) {
  target[DOMAIN_META_KEY] = meta;
}
