import fs from 'fs';
import path from 'path';

import { Request, Response } from 'express';

/**
 * Returns project source files requested by url query param fileName.
 * Don't use in production!
 */
function internalSourceMiddleware(rootDir: string) {
  return async (req: Request, res: Response) => {
    let fileName = req.query.fileName?.toString();

    // Handle files with absolute/relative urls
    if (!fileName) {
      return res.status(500).end();
    }

    // Resolve absolute
    fileName = path.resolve(fileName);

    // Don't allow access outside of project dir
    if (!fileName.startsWith(rootDir)) {
      return res.status(500).end();
    }

    if (!fs.existsSync(fileName)) {
      return res.status(404).end();
    }

    try {
      const fileSource = await fs.promises.readFile(fileName, 'utf8');

      return res.json({
        source: fileSource,
        rootDir, // Used to print relative urls in error-overlay
      });
    } catch (error) {
      return res.status(500).end();
    }
  };
}

export { internalSourceMiddleware };
