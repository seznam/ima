export interface Unit<T> {
  __propertyDeclaration: boolean;
  valueOf: () => T;
  toString: () => string;
}

export interface MapUnit {
  __lessMap: boolean;
  valueOf: (key?: string) => Record<string, number> | number;
  toString: () => string;
}

function asNumberUnit(
  unit: string,
  value: number,
  template = '${parts}${unit}'
): Unit<number> {
  return {
    __propertyDeclaration: true,

    valueOf() {
      return value;
    },

    toString() {
      return template
        .replace('${parts}', value.toString())
        .replace('${unit}', unit);
    },
  };
}

function asUnit(
  unit: string,
  parts: string[] | number[],
  template = '${parts}${unit}'
): Unit<string> {
  return {
    __propertyDeclaration: true,

    valueOf(): string {
      return parts.length === 1 ? parts[0].toString() : this.toString();
    },

    toString(): string {
      return template
        .replace('${parts}', parts.join(','))
        .replace('${unit}', unit);
    },
  };
}

export { asUnit, asNumberUnit };
