import minimist = require('minimist');
import { listMediaFiles } from './file-system.js';

const argv = minimist(process.argv.slice(2));
console.log(argv);

if (!argv.mediaPath) {
  throw new Error('--mediaPath must be specified');
}

if (!argv.extensions) {
  throw new Error('--extensions must be specified');
}

const extRegEx = new RegExp(`.(${argv.extensions})$`);
const files = await listMediaFiles({
  mediaPath: argv.mediaPath,
  extensions: extRegEx,
});

console.log({ files });
