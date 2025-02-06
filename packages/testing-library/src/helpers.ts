import path from 'node:path';

/**
 * Requires specified file from projectPath
 *
 * @param {string} projectPath relative project path to a file
 * @returns {*} File exports
 */
export function importFromProject(projectPath: string) {
  return import(path.resolve(projectPath));
}
