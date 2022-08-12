import { asUnit, Unit } from './utils';

export type MediaType = 'all' | 'print' | 'screen' | 'speach';

export function maxWidthMedia(maxWidth: number, type: MediaType = 'all'): Unit {
  return asUnit(
    '',
    [maxWidth.toString()],
    `~"${type}` + ' and (max-width: ${parts})"'
  );
}

export function minWidthMedia(minWidth: number, type: MediaType = 'all'): Unit {
  return asUnit(
    '',
    [minWidth.toString()],
    `~"${type}` + ' and (min-width: ${parts})"'
  );
}

export function minAndMaxWidthMedia(
  minWidth: number,
  maxWidth: number,
  type: MediaType = 'all'
): Unit {
  return asUnit(
    maxWidth.toString(),
    [minWidth.toString()],
    `~"${type}` + ' and (min-width: ${parts}) and (max-width: ${unit})"'
  );
}

export function maxHeightMedia(
  maxHeight: number,
  type: MediaType = 'all'
): Unit {
  return asUnit(
    '',
    [maxHeight.toString()],
    `~"${type}` + ' and (max-height: ${parts})"'
  );
}

export function minHeightMedia(
  minHeight: number,
  type: MediaType = 'all'
): Unit {
  return asUnit(
    '',
    [minHeight.toString()],
    `~"${type}` + ' and (min-height: ${parts})"'
  );
}
