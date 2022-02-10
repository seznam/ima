import { asNumberUnit, asUnit, Unit } from './utils';

function px(size: number): Unit<number> {
  return asNumberUnit('px', size);
}

function em(size: number): Unit<number> {
  return asNumberUnit('em', size);
}

function rem(size: number): Unit<number> {
  return asNumberUnit('rem', size);
}

function percent(size: number): Unit<number> {
  return asNumberUnit('%', size);
}

function hex(rgb: string): Unit<string> {
  return asUnit('#', [rgb], '${unit}${parts}');
}

function rgba(r: string, g: string, b: string, alpha: string): Unit<string> {
  return asUnit('rgba', [r, g, b, alpha], '${unit}(${parts})');
}

export { px, em, rem, percent, hex, rgba };
