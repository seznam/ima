import { MapUnit } from './utils';

function lessMap(object: Record<string, number>): MapUnit {
  return {
    __lessMap: true,

    valueOf(key) {
      if (!key) {
        return object;
      }

      return object[key];
    },

    toString() {
      return Object.keys(object)
        .map(key => `\t${key}: ${object[key]};\n`)
        .join('');
    },
  };
}

export { lessMap };
