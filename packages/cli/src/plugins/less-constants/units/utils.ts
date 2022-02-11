export interface Unit {
  __propertyDeclaration: boolean;
  valueOf: () => string;
  toString: () => string;
}

export interface MapUnit {
  __lessMap: boolean;
  valueOf: (key?: string) => Record<string, number> | number;
  toString: () => string;
}

function asUnit(
  unit: string,
  parts: string[] | number[],
  template = '${parts}${unit}'
): Unit {
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

export { asUnit };
