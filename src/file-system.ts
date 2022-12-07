import dirTree = require('directory-tree');
import deepReduce = require('deep-reduce');

interface IObj {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const listMediaFiles = (params: {
  mediaPath: string;
  extensions?: RegExp;
}): IObj[] => {
  const { mediaPath, extensions } = params;

  const tree = dirTree(mediaPath, {
    attributes: ['extension'],
    extensions,
  });

  let fileList = [];

  if (tree) {
    fileList = deepReduce(
      tree,
      (reduced, value) => {
        // console.log({ reduced, value, path });
        if (value.extension) {
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
