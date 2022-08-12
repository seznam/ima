import { asUnit, Unit } from './utils';

function sizeUnitFactory(unit: string) {
  return (size: number): Unit => asUnit(unit, [size]);
}

export const em = sizeUnitFactory('em');
export const ex = sizeUnitFactory('ex');
export const ch = sizeUnitFactory('ch');
export const rem = sizeUnitFactory('rem');
export const lh = sizeUnitFactory('lh');
export const rlh = sizeUnitFactory('rlh');
export const vw = sizeUnitFactory('vw');
export const vh = sizeUnitFactory('vh');
export const vmin = sizeUnitFactory('vmin');
export const vmax = sizeUnitFactory('vmax');
export const vb = sizeUnitFactory('vb');
export const vi = sizeUnitFactory('vi');
export const svw = sizeUnitFactory('svw');
export const svh = sizeUnitFactory('svh');
export const lvw = sizeUnitFactory('lvw');
export const lvh = sizeUnitFactory('lvh');
export const dvw = sizeUnitFactory('dvw');
export const dvh = sizeUnitFactory('dvh');
export const cm = sizeUnitFactory('cm');
export const mm = sizeUnitFactory('mm');
export const Q = sizeUnitFactory('Q');
export const inches = sizeUnitFactory('in');
export const pc = sizeUnitFactory('pc');
export const pt = sizeUnitFactory('pt');
export const px = sizeUnitFactory('px');
export const percent = sizeUnitFactory('%');

export function hex(hex: string): Unit {
  return asUnit('#', [hex], '${unit}${parts}');
}

export function rgb(red: number, green: number, blue: number): Unit {
  return asUnit('rgb', [red, green, blue], '${unit}(${parts})');
}

export function rgba(
  red: number,
  green: number,
  blue: number,
  alpha: number
): Unit {
  return asUnit('rgba', [red, green, blue, alpha], '${unit}(${parts})');
}

export function hsl(hue: number, saturation: number, lightness: number): Unit {
  return asUnit(
    'hsl',
    [hue, `${saturation}%`, `${lightness}%`],
    '${unit}(${parts})'
  );
}

export function hsla(
  hue: number,
  saturation: number,
  lightness: number,
  alpha: number
): Unit {
  return asUnit(
    'hsla',
    [hue, `${saturation}%`, `${lightness}%`, alpha],
    '${unit}(${parts})'
  );
}
