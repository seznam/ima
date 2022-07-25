import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { globby } from 'globby';
import jsdoc2md from 'jsdoc-to-markdown';

const GIT_BASE_URL = 'https://github.com/seznam/ima/tree/next/packages/core';

const dirname = fileURLToPath(path.dirname(import.meta.url));
const outputDir = path.resolve(dirname, '../../docs/api');
const partialsDir = path.resolve(dirname, './partials/');

async function main() {
  // Create clean output dir
  await fs.promises.rm(outputDir, { recursive: true, force: true });
  await fs.promises.mkdir(outputDir, { recursive: true });

  // Init jsdoc2md config
  const config = {
    separators: true,
    partial: [
      path.join(partialsDir, 'docs.hbs'),
      path.join(partialsDir, 'header.hbs'),
      path.join(partialsDir, 'main.hbs'),
    ],
  };

  const pkgBasePath = path.resolve(dirname, '../../packages/core/src');
  const files = await globby([
    path.join(pkgBasePath, '**/*.(js|jsx)'),
    `!*/**/__tests__`,
  ]);

  // Generate markdown files
  await Promise.all(
    [files[1]].map(async file => {
      const templateData = (
        await jsdoc2md.getTemplateData({ files: file })
      ).map(item => {
        if (item.meta) {
          const { filename, lineno = 1, path: itemPath } = item.meta;
          const relativePath = path.relative(
            path.resolve(pkgBasePath, '..'),
            itemPath
          );

          item.imaGitUrl = `${GIT_BASE_URL}/${relativePath}/${filename}#L${lineno}`;
          item.meta.relativePath = relativePath;
        }

        return item;
      });

      const relativePath = path.relative(pkgBasePath, file);
      const { name } = path.parse(relativePath);
      const outputPath = path.join(outputDir, `${name}.md`);

      // Convert jsdoc metdata to markdown
      const markdownContents = await jsdoc2md.render({
        ...config,
        data: templateData,
      });

      await fs.promises.mkdir(outputDir, { recursive: true });
      await fs.promises.writeFile(outputPath, markdownContents);
    })
  );
}

main();
