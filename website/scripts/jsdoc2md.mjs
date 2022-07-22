import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { globby } from 'globby';
import jsdoc2md from 'jsdoc-to-markdown';

const gitUrl = 'asdfads';
const dirname = fileURLToPath(path.dirname(import.meta.url));
const basePath = path.resolve(dirname, '../../packages/core/src');
const files = await globby([
  path.join(basePath, '**/*.(js|jsx)'),
  `!*/**/__tests__`,
]);

const outputs = await Promise.all(
  [files[0]].map(async file => {
    const data = (await jsdoc2md.getTemplateData({ files: file })).map(item => {
      if (item.meta) {
        item.meta.relativePath = path.relative(
          path.resolve(basePath, '..'),
          item.meta.path
        );
      }

      return item;
    });

    const relativePath = path.relative(basePath, file);
    const { name } = path.parse(relativePath);
    const outputPath = path.resolve(dirname, '../src/pages/api', `${name}.md`);

    const markdownContents = await jsdoc2md.render({ data });

    // Remove existing
    if (fs.existsSync(outputPath)) {
      await fs.promises.rm(outputPath);
    }

    await fs.promises.writeFile(outputPath, markdownContents);
  })
);
