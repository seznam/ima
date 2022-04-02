import { asUnit, Unit } from './utils';

function px(size: number): Unit {
  return asUnit('px', [size]);
}

function em(size: number): Unit {
  return asUnit('em', [size]);
}

function rem(size: number): Unit {
  return asUnit('rem', [size]);
}

function percent(size: number): Unit {
  return asUnit('%', [size]);
}

function hex(rgb: string): Unit {
  return asUnit('#', [rgb], '${unit}${parts}');
}

function rgba(r: string, g: string, b: string, alpha: string): Unit {
  return asUnit('rgba', [r, g, b, alpha], '${unit}(${parts})');
}

export { px, em, rem, percent, hex, rgba };
