import dirTree = require('directory-tree');
import deepReduce = require('deep-reduce');
import { MediaFile } from './types.js';

export const listMediaFiles = (params: {
  mediaPath: string;
  extensions?: RegExp;
}): MediaFile[] => {
  const { mediaPath, extensions } = params;

  console.log(`${new Date().toLocaleString()} building list of media files`);

  const tree = dirTree(mediaPath, {
    attributes: ['extension'],
    extensions,
  });

  let fileList = [];

  if (tree) {
    fileList = deepReduce(
      tree,
      (reduced, value) => {
        // console.log({ reduced, value });
        if (value.extension && value.path.indexOf('Plex Versions') === -1) {
          reduced.push(value);
        }
        return reduced;
      },
      [],
    );
  } else {
    throw new Error(
      `Did not find any media files at specified: ${JSON.stringify({
        mediaPath,
        extensions: extensions.toString(),
      })}`,
    );
  }

  return fileList;
};
