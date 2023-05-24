import { join as pathJoin } from 'path';
import { mkdirSync } from 'fs';
import { extractMetaData, transcodeMedia } from './ffmpeg.js';
import { ConvertToEnum, StateFile } from './types.js';
import { saveState, updateStateWithTranscodeResults } from './utilities.js';

export const transcodeAndUpdateState = async (params: {
  stateFile: StateFile;
  stateIndex: number;
  convertTo: ConvertToEnum;
  convertToFolder: string;
  convertToAppend: string;
  state: StateFile[];
}): Promise<StateFile[]> => {
  const {
    stateFile,
    stateIndex,
    convertTo,
    convertToFolder,
    convertToAppend,
    state,
  } = params;

  if (stateFile.transcoded[convertTo] > 0) {
    console.log(
      `${new Date().toLocaleString()} skipping already transcoded ${convertTo}`,
    );

    return state;
  } else {
    console.log(`${new Date().toLocaleString()} transcoding ${convertTo}`);

    const outDirPath = pathJoin(
      stateFile.path.replace(stateFile.name, ''),
      convertToFolder,
    );

    mkdirSync(outDirPath, { recursive: true });

    const outPath = pathJoin(
      outDirPath,
      stateFile.name.replace(stateFile.extension, convertToAppend),
    );

    const result = await transcodeMedia({
      mediaPath: stateFile.path,
      outPath: outPath,
      convertTo,
      aspectRatio: stateFile.metadata.original.video.aspect.string,
    });

    console.log('outPath', outPath);
    const metadata = await extractMetaData({ mediaPath: outPath });

    console.log('metadata', metadata);
    const newState = updateStateWithTranscodeResults({
      transcodedMetadata: metadata,
      transcodedStateIndex: stateIndex,
      transcodedTime: result,
      convertTo,
      state,
    });

    return newState;
  }
};
