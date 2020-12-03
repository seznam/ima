const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const rimraf = require('rimraf');

const IN = path.resolve(__dirname, './dist');
const OUT = path.resolve(__dirname, './out');

// Clean & create out directory
rimraf.sync(OUT);
fs.mkdirSync(OUT);

const archive = archiver('zip', { zlib: { level: 9 } });
const stream = fs.createWriteStream(path.join(OUT, 'ima.devtools.zip'));

new Promise((resolve, reject) => {
  archive
    .directory(IN, false)
    .on('error', err => reject(err))
    .pipe(stream);

  stream.on('close', () => resolve());
  archive.finalize();
});
