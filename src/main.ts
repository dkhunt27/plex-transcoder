// https://stackoverflow.com/questions/55675902/how-to-containerize-a-nodejs-app-with-cron-jobs-using-docker

import minimist = require('minimist');
import {
  extractMetaData,
  transcodeMedia,
  updateStateWithMetadata,
} from './ffmpeg.js';
import { listMediaFiles } from './file-system.js';
import { ConvertToEnum } from './types.js';
import {
  validateInputs,
  validateLockFileDoesNotExist,
  loadPreviousState,
  updateStateWithCurrentFileList,
  saveState,
  errorMessage,
  updateStateWithTranscodeResults,
} from './utilities.js';
import { join as pathJoin } from 'path';
import { mkdirSync } from 'fs';
import { transcodeAndUpdateState } from './transcode.js';

/*
  Process inputs:
    - validate expected inputs received
    - validate media folder exists

  Check for lock file, exit if lock file exists
    - Output not running due to lock file

  create list of files to process

  load previous state
    - file list with processed/ignore info

  build current state from prev state and list of files
    - save full list back to state file

  loop top: (maybe move to before list of files to process?)

    check execution window to see if time to run
      - if time to run, run... if not exit

    select next file to process

    transcode to 1080
      - check codec, audio, format
      - save metrics
    
    transcode to 780
      - check codec, audio, format
      - save metrics

    mark file processed, go to loop top
*/

const argv = minimist(process.argv.slice(2));
console.log(argv);

try {
  validateInputs(argv);
  validateLockFileDoesNotExist();

  console.log('argv.mediaPath', argv.mediaPath);
  // create list of files to process
  const files = listMediaFiles({
    mediaPath: argv.mediaPath,
    extensions: new RegExp(`.(${argv.extensions})$`),
  });

  const prevState = loadPreviousState();

  let state = updateStateWithCurrentFileList({ files, prevState });

  state = await updateStateWithMetadata({ state });

  saveState({ state });

  console.log(` `);
  console.log(` `);
  console.log(
    `${new Date().toLocaleString()} Starting file transcoding process`,
  );
  console.log(` `);
  console.log(` `);

  for (const [stateIndex, stateFile] of state.entries()) {
    console.log(
      `${new Date().toLocaleString()} Processing file: ${stateFile.path}`,
    );
    console.log(` `);
    // todo print out process count of total count

    if (stateFile.ignore) {
      console.log(`${new Date().toLocaleString()} ignoring file`);
    } else if (stateFile.processed) {
      console.log(
        `${new Date().toLocaleString()} skipping already processed file`,
      );
    } else {
      state = await transcodeAndUpdateState({
        stateFile,
        stateIndex,
        convertTo: ConvertToEnum.to1080,
        convertToFolder: 'Plex Versions/Optimized for TV',
        convertToAppend: ' - 1080.mp4',
        state,
      });

      saveState({ state });

      state = await transcodeAndUpdateState({
        stateFile,
        stateIndex,
        convertTo: ConvertToEnum.to720,
        convertToFolder: 'Plex Versions/Optimized for Mobile',
        convertToAppend: ' - 720.mp4',
        state,
      });

      stateFile.processed = true;

      saveState({ state });
    }
  }

  process.exit(0);
} catch (err) {
  const errMsg = errorMessage(err);
  console.error(`Error occurred during processing: ${errMsg}`);
  process.exit(1);
}
