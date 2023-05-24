import { extractMetaData, updateStateWithMetadata } from '../src/ffmpeg.js';
import { StateFile } from '../src/types.js';

describe('ffmpeg', () => {
  describe('extractMetaData', () => {
    it('throws an error if path is not found', async () => {
      await expect(
        extractMetaData({ mediaPath: 'does/not/exist' }),
      ).rejects.toEqual(
        'Error trying to extract media metadata: The input file does not exist {"mediaPath":"does/not/exist"}',
      );
    });
    it('returns metadata for found file', async () => {
      const actual = await extractMetaData({
        mediaPath: 'tests/media/avi/file_example_AVI_1920_2_3MG.avi',
      });
      expect(actual).toEqual({
        album: '',
        artist: '',
        audio: {
          bitrate: '139',
          channels: { raw: 'stereo', value: 2 },
          codec: 'aac',
          sample_rate: 48000,
          stream: 0,
        },
        date: '',
        duration: { raw: '00:00:30.61', seconds: 30 },
        filename: 'tests/media/avi/file_example_AVI_1920_2_3MG.avi',
        synched: true,
        title: '',
        track: '',
        video: {
          aspect: { string: '16:9', value: 1.7777777777777777, x: 16, y: 9 },
          bitrate: 595,
          codec: 'h264',
          container: 'avi',
          fps: 30,
          pixel: 1,
          pixelString: '1:1',
          resolution: { h: 1080, w: 1920 },
          resolutionSquare: { h: 1080, w: 1920 },
          rotate: 0,
          stream: 0,
        },
      });
    });
  });

  describe('updateStateWithMetadata', () => {
    let state: StateFile[];
    beforeEach(() => {
      state = [
        {
          path: 'tests/media/avi/file_example_AVI_1920_2_3MG.avi',
          name: 'file_example_AVI_1920_2_3MG.avi',
          extension: '.avi',
          processed: false,
          ignore: false,
          transcoded: {},
          metadata: {},
        },
        {
          path: 'tests/media/mov/file_example_MOV_1920_2_2MB.mov',
          name: 'file_example_MOV_1920_2_2MB.mov',
          extension: '.mov',
          processed: false,
          ignore: false,
          transcoded: {},
          metadata: {},
        },
        {
          path: 'tests/media/mp4/file_example_MP4_1920_18MG.mp4',
          name: 'file_example_MP4_1920_18MG.mp4',
          extension: '.mp4',
          processed: false,
          ignore: false,
          transcoded: {},
          metadata: {},
        },
        {
          path: 'tests/media/avi/test.mp4',
          name: 'test.mp4',
          extension: '.mp4',
          processed: false,
          ignore: false,
          transcoded: {},
          metadata: {},
        },
        {
          path: 'tests/media/avi/test2.mp4',
          name: 'test2.mp4',
          extension: '.mp4',
          processed: false,
          ignore: false,
          transcoded: {},
          metadata: {},
        },
      ];
    });
    it('returns no files if dir has no matching files', async () => {
      const actual = await updateStateWithMetadata({ state });
      console.log('actual', JSON.stringify(actual));
      expect(actual).toEqual([
        {
          path: 'tests/media/avi/file_example_AVI_1920_2_3MG.avi',
          name: 'file_example_AVI_1920_2_3MG.avi',
          extension: '.avi',
          processed: false,
          ignore: false,
          transcoded: {},
          metadata: {
            original: {
              filename: 'tests/media/avi/file_example_AVI_1920_2_3MG.avi',
              title: '',
              artist: '',
              album: '',
              track: '',
              date: '',
              synched: true,
              duration: { raw: '00:00:30.61', seconds: 30 },
              video: {
                container: 'avi',
                bitrate: 595,
                stream: 0,
                codec: 'h264',
                resolution: { w: 1920, h: 1080 },
                resolutionSquare: { w: 1920, h: 1080 },
                aspect: {
                  x: 16,
                  y: 9,
                  string: '16:9',
                  value: 1.7777777777777777,
                },
                rotate: 0,
                fps: 30,
                pixelString: '1:1',
                pixel: 1,
              },
              audio: {
                codec: 'aac',
                bitrate: '139',
                sample_rate: 48000,
                stream: 0,
                channels: { raw: 'stereo', value: 2 },
              },
            },
          },
        },
        {
          path: 'tests/media/mov/file_example_MOV_1920_2_2MB.mov',
          name: 'file_example_MOV_1920_2_2MB.mov',
          extension: '.mov',
          processed: false,
          ignore: false,
          transcoded: {},
          metadata: {
            original: {
              filename: 'tests/media/mov/file_example_MOV_1920_2_2MB.mov',
              title: '',
              artist: '',
              album: '',
              track: '',
              date: '',
              synched: true,
              duration: { raw: '00:00:30.57', seconds: 30 },
              video: {
                container: 'mov',
                bitrate: 588,
                stream: 0,
                codec: 'h264',
                resolution: { w: 1920, h: 1080 },
                resolutionSquare: { w: 1920, h: 1080 },
                aspect: {
                  x: 16,
                  y: 9,
                  string: '16:9',
                  value: 1.7777777777777777,
                },
                rotate: 0,
                fps: 30,
                pixelString: '1:1',
                pixel: 1,
              },
              audio: {
                codec: 'aac',
                bitrate: '139',
                sample_rate: 48000,
                stream: 0,
                channels: { raw: 'stereo', value: 2 },
              },
            },
          },
        },
        {
          path: 'tests/media/mp4/file_example_MP4_1920_18MG.mp4',
          name: 'file_example_MP4_1920_18MG.mp4',
          extension: '.mp4',
          processed: false,
          ignore: false,
          transcoded: {},
          metadata: {
            original: {
              filename: 'tests/media/mp4/file_example_MP4_1920_18MG.mp4',
              title: '',
              artist: '',
              album: '',
              track: '',
              date: '',
              synched: true,
              duration: { raw: '00:00:30.53', seconds: 30 },
              video: {
                container: 'mov',
                bitrate: 4675,
                stream: 0,
                codec: 'h264',
                resolution: { w: 1920, h: 1080 },
                resolutionSquare: { w: 1920, h: 1080 },
                aspect: {
                  x: 16,
                  y: 9,
                  string: '16:9',
                  value: 1.7777777777777777,
                },
                rotate: 0,
                fps: 30,
                pixelString: '1:1',
                pixel: 1,
              },
              audio: {
                codec: 'aac',
                bitrate: '256',
                sample_rate: 48000,
                stream: 0,
                channels: { raw: 'stereo', value: 2 },
              },
            },
          },
        },
        {
          path: 'tests/media/avi/test.mp4',
          name: 'test.mp4',
          extension: '.mp4',
          processed: false,
          ignore: false,
          transcoded: {},
          metadata: {
            original: {
              filename: 'tests/media/avi/test.mp4',
              title: '',
              artist: '',
              album: '',
              track: '',
              date: '',
              synched: true,
              duration: { raw: '00:00:30.59', seconds: 30 },
              video: {
                container: 'mov',
                bitrate: 1929,
                stream: 0,
                codec: 'h264',
                resolution: { w: 1280, h: 720 },
                resolutionSquare: { w: 1280, h: 720 },
                aspect: {
                  x: 16,
                  y: 9,
                  string: '16:9',
                  value: 1.7777777777777777,
                },
                rotate: 0,
                fps: 30,
                pixelString: '1:1',
                pixel: 1,
              },
              audio: {
                codec: 'aac',
                bitrate: '2',
                sample_rate: 48000,
                stream: 0,
                channels: { raw: 'stereo', value: 2 },
              },
            },
          },
        },
        {
          path: 'tests/media/avi/test2.mp4',
          name: 'test2.mp4',
          extension: '.mp4',
          processed: false,
          ignore: false,
          transcoded: {},
          metadata: {
            original: {
              filename: 'tests/media/avi/test2.mp4',
              title: '',
              artist: '',
              album: '',
              track: '',
              date: '',
              synched: true,
              duration: { raw: '00:00:30.59', seconds: 30 },
              video: {
                container: 'mov',
                bitrate: 1941,
                stream: 0,
                codec: 'h264',
                resolution: { w: 1280, h: 720 },
                resolutionSquare: { w: 1280, h: 720 },
                aspect: {
                  x: 16,
                  y: 9,
                  string: '16:9',
                  value: 1.7777777777777777,
                },
                rotate: 0,
                fps: 30,
                pixelString: '1:1',
                pixel: 1,
              },
              audio: {
                codec: 'aac',
                bitrate: '2',
                sample_rate: 48000,
                stream: 0,
                channels: { raw: 'stereo', value: 2 },
              },
            },
          },
        },
      ]);
    });
  });
});
