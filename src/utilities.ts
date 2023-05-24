import { readdirSync, readFileSync, existsSync, writeFileSync } from 'fs';
import {
  ConvertToEnum,
  FFMpegMetaData,
  MediaFile,
  StateFile,
} from './types.js';

const STATE_FILE_PATH = './plex-transcoder.state.json';

export const validateInputs = (params: {
  mediaPath: string;
  extensions: RegExp;
}): void => {
  const { mediaPath, extensions } = params;

  if (!mediaPath) {
    throw new Error('--mediaPath must be specified');
  }

  if (!extensions) {
    throw new Error('--extensions must be specified');
  }

  if (!readdirSync(mediaPath)) {
    throw new Error(
      `mediaPath does not exist: ${JSON.stringify({
        mediaPath,
      })}`,
    );
  }
};

export const validateLockFileDoesNotExist = (): void => {
  if (existsSync('./plex-transcoder.lock')) {
    throw new Error(`plex-transcoder.lock exist; stopping execution`);
  }
};

export const loadPreviousState = (): StateFile[] => {
  if (existsSync(STATE_FILE_PATH)) {
    try {
      console.log(`${new Date().toLocaleString()} loading prev state`);
      const state = JSON.parse(readFileSync(STATE_FILE_PATH).toString());
      return state;
    } catch (err) {
      throw new Error(
        `${STATE_FILE_PATH} not parsed correctly: ${err.message ?? err}`,
      );
    }
  } else {
    return [];
  }
};

export const updateStateWithCurrentFileList = (params: {
  files: MediaFile[];
  prevState: StateFile[];
}): StateFile[] => {
  const { files, prevState } = params;

  console.log(
    `${new Date().toLocaleString()} building state from file list and prev state`,
  );

  for (const file of files) {
    const foundInPrevState = prevState.find((item) => item.path === file.path);
    if (!foundInPrevState) {
      prevState.push({
        ...file,
        processed: false,
        ignore: false,
        transcoded: {},
        metadata: {},
      });
    }
  }

  return prevState;
};

export const updateStateWithTranscodeResults = (params: {
  transcodedStateIndex: number;
  transcodedMetadata: FFMpegMetaData;
  transcodedTime: number;
  convertTo: ConvertToEnum;
  state: StateFile[];
}): StateFile[] => {
  const {
    transcodedMetadata,
    transcodedTime,
    transcodedStateIndex,
    convertTo,
    state,
  } = params;

  state[transcodedStateIndex].transcoded[convertTo] = transcodedTime;
  state[transcodedStateIndex].metadata[convertTo] = transcodedMetadata;

  return state;
};

export const saveState = (params: { state: StateFile[] }): void => {
  const { state } = params;
  console.log(`${new Date().toLocaleString()} saving state`);
  writeFileSync(STATE_FILE_PATH, JSON.stringify(state, null, 2));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorMessage = (err: any): string => {
  switch (typeof err) {
    case 'string':
      return err;
    case 'object':
      if (err.message) {
        return err.message;
      } else if (err.msg) {
        return err.msg;
      } else {
        return JSON.stringify(err);
      }
    default:
      console.error(`Unhandled err type: ${typeof err}`);
      return err;
  }
};
