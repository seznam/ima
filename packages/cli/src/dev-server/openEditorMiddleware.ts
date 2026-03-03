import { logger } from '@ima/dev-utils/logger';
import chalk from 'chalk';
import envEditor from 'env-editor';
import { Request, Response } from 'express';
import openEditor from 'open-editor';

/**
 * Return preferred editor identifier
 */
function getEditor() {
  // Prioritize explicit config
  if (process.env.IMA_EDITOR) {
    return process.env.IMA_EDITOR;
  }

  // Re-use create-react-app editor
  if (process.env.REACT_EDITOR) {
    return process.env.REACT_EDITOR;
  }

  return process.env.EDITOR;
}

/**
 * Open code editor at given file, line and column, if supported.
 * If there are no editor env variables defined, it prints an
 * instructions with stepts to setup this functionality.
 */
function launchEditor(fileName: string, line: number, column: number): void {
  const editor = getEditor();

  if (!editor) {
    const supportedEditors = envEditor.allEditors().map(editor => editor.id);

    logger.error(
      `${chalk.underline('Unable to open:')} ${chalk.cyan(
        '$IMA_EDITOR'
      )}, ${chalk.cyan('$REACT_EDITOR')} or ${chalk.cyan(
        '$EDITOR'
      )} env variables are empty.\n` +
        'Set it to the command/path of your editor in ~/.zshenv or ~/.bashrc\n\n' +
        `${chalk.magenta('Supported values:')} ${supportedEditors.join(', ')}\n`
    );

    return;
  }

  openEditor(
    [
      {
        file: fileName,
        line,
        column,
      },
    ],
    { editor }
  );
}

function openEditorMiddleware() {
  return async (req: Request, res: Response) => {
    const { fileName, line, column } = req.query;

    if (!fileName) {
      return res.status(500).end();
    }

    try {
      launchEditor(
        fileName?.toString(),
        line ? parseInt(line.toString()) : 1,
        column ? parseInt(column.toString()) : 1
      );
    } catch (error) {
      logger.error(error as Error);
    }

    return res.status(200).end();
  };
}

export { openEditorMiddleware };
