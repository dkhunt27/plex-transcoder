// https://www.npmjs.com/package/ffmpeg

// https://www.plexopedia.com/plex-media-server/general/avoid-transcoding/
// Container: mp4
// Resolution: 1920x1080 or lower
// Video codec: H.264 (level 4.0 or lower)
// Framerate: 30 fps (bit depth: 8)
// Audio Codec: AAC (2 channels)
// Bitrate: 20 Mbps or lower

// https://support.plex.tv/articles/201358273-converting-iso-video-ts-and-other-disk-image-formats/
// ffmpeg -i inputfile.mkv -crf 18 -map 0 -acodec copy -scodec copy -c:v libx264 -threads 0 -preset veryslow outputfile.mkv

import { ConvertToEnum, FFMpegMetaData, StateFile } from './types.js';
// import ffmpeg = require('ffmpeg');
import { errorMessage } from './utilities.js';
import FFMpeg = require('ffmpeg');
import FluentFFMpeg = require('fluent-ffmpeg');
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import { path as ffprobePath } from '@ffprobe-installer/ffprobe';
import cliProgress = require('cli-progress');

FluentFFMpeg.setFfmpegPath(ffmpegPath);
FluentFFMpeg.setFfprobePath(ffprobePath);

const optimized = {
  [ConvertToEnum.to1080]: {
    audio: {
      codec: 'aac',
      channels: 2,
    },
    video: {
      codec: 'h264',
      format: 'mp4',
      frameRate: 30,
      bitRate: 8000,
      resolution: '1920x?',
    },
  },
  [ConvertToEnum.to720]: {
    audio: {
      codec: 'aac',
      channels: 2,
    },
    video: {
      codec: 'h.264',
      format: 'mp4',
      frameRate: 30,
      bitRate: 2000,
      resolution: '1280x?',
    },
  },
};

export const extractMetaData = async (params: {
  mediaPath: string;
}): Promise<FFMpegMetaData> => {
  const { mediaPath } = params;

  try {
    // const filePath = pathJoin(process.cwd(), mediaPath);
    console.log(
      `${new Date().toLocaleString()} extracting metadata from ${mediaPath}`,
    );
    const media = await new FFMpeg(mediaPath);
    return media.metadata;
    // return new Promise((resolve) => {
    //   FluentFFMpeg.ffprobe(mediaPath, (err, media) => {
    //     const m: any = {};
    //     media.streams.forEach((stream) => {
    //       if (stream.codec_type === 'video') {
    //         m.videoCodec = stream.codec_name;
    //         m.width = stream.width;
    //         m.height = stream.height;
    //         m.aspectRatio = stream.display_aspect_ratio;
    //       } else if (stream.codec_type === 'audio') {
    //         m.audioCodec = stream.codec_name;
    //         m.audioChannels = stream.channels;
    //       }
    //     });
    //     m.fileName = media.format.filename;
    //     m.duration = media.format.duration;
    //     m.size = media.format.size;
    //     m.bitRate = media.format.bit_rate;

    //     console.log('media', JSON.stringify(m, null, 2));
    //     resolve(m);
    //   });
    // });
  } catch (err) {
    const errMsg = errorMessage(err);
    const fullErrMsg = `Error trying to extract media metadata: ${errMsg} ${JSON.stringify(
      { mediaPath },
    )}`;
    console.error(fullErrMsg);
    return Promise.reject(fullErrMsg);
  }
};

const hrtimeToSecs = function (hrtime: [number, number]): number {
  const precision = 3; // 3 decimal places
  const elapsed = hrtime[1] / 1000000; // divide by a million to get nano to milli
  console.log(hrtime[0] + ' s, ' + elapsed.toFixed(precision) + ' ms'); // print message + time

  const timeInMs = hrtime[0] * 1000 + hrtime[1] / 1000000;

  return Math.round(timeInMs / 1000);
};

export const transcodeMedia = async (params: {
  mediaPath: string;
  outPath: string;
  convertTo: ConvertToEnum;
  aspectRatio: string;
}): Promise<number> => {
  return new Promise((resolve, reject) => {
    const { mediaPath, convertTo, outPath, aspectRatio } = params;

    console.log(
      `${new Date().toLocaleString()} transcoding to ${convertTo} file: ${mediaPath}`,
    );

    const progressBar = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic,
    );
    progressBar.start(100, 0);
    const hrtime = process.hrtime();

    try {
      const optimizeTo = optimized[convertTo];

      console.log('optimizeTo', optimizeTo);
      console.log('mediaPath', mediaPath);

      new FluentFFMpeg(mediaPath, { vcodec: optimizeTo.video.codec }).sub
        .audioCodec(optimizeTo.audio.codec)
        .audioChannels(2)
        .videoBitrate(optimizeTo.video.bitRate)
        // .videoCodec(optimizeTo.video.codec)
        .fps(optimizeTo.video.frameRate)
        .aspectRatio(aspectRatio)
        .size(optimizeTo.video.resolution)
        .format(optimizeTo.video.format)

        .on('progress', function (progress) {
          progressBar.update(progress.percent);
        })
        .on('end', function () {
          progressBar.update(100);
          console.log(' ');
          console.log(
            `${new Date().toLocaleString()} transcoding complete to ${convertTo} file: ${mediaPath}`,
          );
          const end = process.hrtime(hrtime);
          const secs = hrtimeToSecs(end);
          return resolve(secs);
        })
        .on('error', function (err) {
          const errMsg = errorMessage(err);
          console.error(
            `${new Date().toLocaleString()} error: ${errMsg} transcoding to ${convertTo} file: ${mediaPath}`,
          );
          return reject(err);
        })
        // save to file
        .save(outPath);
    } catch (err) {
      const errMsg = errorMessage(err);
      console.error(`Error trying to transcode media: ${errMsg}`);
      return reject(err);
    }
  });
};

export const updateStateWithMetadata = async (params: {
  state: StateFile[];
}): Promise<StateFile[]> => {
  const { state } = params;

  console.log(`${new Date().toLocaleString()} updating state with metadata`);

  for (const stateFile of state) {
    const metadata = await extractMetaData({ mediaPath: stateFile.path });
    stateFile.metadata.original = metadata;
  }

  return state;
};
