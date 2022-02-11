import { asUnit, Unit } from './utils';

function maxWidthMedia(maxWidth: number): Unit {
  return asUnit('', [maxWidth.toString()], '~"all and (max-width: ${parts})"');
}

function minWidthMedia(minWidth: number): Unit {
  return asUnit('', [minWidth.toString()], '~"all and (min-width: ${parts})"');
}

function minAndMaxWidthMedia(minWidth: number, maxWidth: number): Unit {
  return asUnit(
    maxWidth.toString(),
    [minWidth.toString()],
    '~"all and (min-width: ${parts}) and (max-width: ${unit})"'
  );
}

function maxHeightMedia(maxHeight: number): Unit {
  return asUnit(
    '',
    [maxHeight.toString()],
    '~"all and (max-height: ${parts})"'
  );
}

function minHeightMedia(minHeight: number): Unit {
  return asUnit(
    '',
    [minHeight.toString()],
    '~"all and (min-height: ${parts})"'
  );
}

export {
  maxWidthMedia,
  minWidthMedia,
  minAndMaxWidthMedia,
  maxHeightMedia,
  minHeightMedia,
};
