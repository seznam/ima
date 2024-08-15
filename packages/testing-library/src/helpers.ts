import path from 'path';

/**
 * Requires specified file from projectPath
 *
 * @param {string} projectPath relative project path to a file
 * @returns {*} File exports
 */
export function requireFromProject(projectPath: string) {
  return require(path.resolve(projectPath));
}
