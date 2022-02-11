/**
 * Generates less variables from given object of values.
 */
function generateLessVariables(values: Record<string, unknown>): string {
  const lessConstants = Object.keys(values)
    .map(key => {
      const value = processValue(
        key,
        values[key] as Record<string, unknown> | string
      );

      return value;
    })
    .join('\n');

  return `// This file was automatically generated using LessConstantsPlugin\n\n${lessConstants}`;
}

/**
 * Processes provided value which can be either object or constant value recursively.
 */
function processValue(
  property: string,
  value: Record<string, unknown> | string,
  prefix = '@'
): string {
  // Generate label prefix
  const subPrefix = prefix + (prefix.length > 1 ? '-' : '') + slugify(property);

  // Process less maps
  if (value instanceof Object && value.__lessMap) {
    return `${subPrefix}: {\n${value.toString()}}\n`;
  }

  // Process other property declarations
  if (value instanceof Object && !value.__propertyDeclaration) {
    return Object.keys(value)
      .map((subProperty: string) =>
        processValue(
          subProperty,
          value[subProperty] as Record<string, unknown> | string,
          subPrefix
        )
      )
      .join('');
  }

  return `${subPrefix}: ${value.toString()};\n`;
}

/**
 * Slugify provided value label (camelCase into dash-case)
 */
function slugify(label: string): string {
  let result = '';

  for (let i = 0; i < label.length; i++) {
    const char = label.substring(i, i + 1);
    if (i && !/-|\d/.test(char) && char.toUpperCase() === char) {
      result += `-${char.toLowerCase()}`;
    } else {
      result += char;
    }
  }

  return result;
}

export { generateLessVariables, processValue, slugify };
