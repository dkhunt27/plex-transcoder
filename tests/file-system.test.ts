import { listMediaFiles } from '../src/file-system.js';

describe('file-system', () => {
  it('throws an error if root dir is not found', () => {
    expect(() => listMediaFiles({ mediaPath: 'does/not/exist' })).toThrow(
      'Did not find any media files at specified: {"mediaPath":"does/not/exist"}',
    );
  });
  it('returns no files if dir has no matching files', () => {
    const actual = listMediaFiles({
      mediaPath: './tests/media',
      extensions: /\.(foobar)$/,
    });
    expect(actual).toEqual([]);
  });
  it('returns file tree when files found', () => {
    const actual = listMediaFiles({ mediaPath: './tests/media' });
    expect(actual).toEqual([
      {
        extension: '.avi',
        name: 'file_example_AVI_1920_2_3MG.avi',
        path: 'tests/media/avi/file_example_AVI_1920_2_3MG.avi',
      },
      {
        extension: '.mov',
        name: 'file_example_MOV_1920_2_2MB.mov',
        path: 'tests/media/mov/file_example_MOV_1920_2_2MB.mov',
      },
      {
        extension: '.mp4',
        name: 'file_example_MP4_1920_18MG.mp4',
        path: 'tests/media/mp4/file_example_MP4_1920_18MG.mp4',
      },
      {
        extension: '.ogg',
        name: 'file_example_OGG_1920_13_3mg.ogg',
        path: 'tests/media/ogg/file_example_OGG_1920_13_3mg.ogg',
      },
      {
        extension: '.webm',
        name: 'file_example_WEBM_1920_3_7MB.webm',
        path: 'tests/media/webm/file_example_WEBM_1920_3_7MB.webm',
      },
      {
        extension: '.wmv',
        name: 'file_example_WMV_1920_9_3MB.wmv',
        path: 'tests/media/wmv/file_example_WMV_1920_9_3MB.wmv',
      },
    ]);
  });
  it('returns subset of file tree when files found and extensions provided', () => {
    const actual = listMediaFiles({
      mediaPath: './tests/media',
      extensions: /\.(avi|mov|mp4)$/,
    });
    expect(actual).toEqual([
      {
        extension: '.avi',
        name: 'file_example_AVI_1920_2_3MG.avi',
        path: 'tests/media/avi/file_example_AVI_1920_2_3MG.avi',
      },
      {
        extension: '.mov',
        name: 'file_example_MOV_1920_2_2MB.mov',
        path: 'tests/media/mov/file_example_MOV_1920_2_2MB.mov',
      },
      {
        extension: '.mp4',
        name: 'file_example_MP4_1920_18MG.mp4',
        path: 'tests/media/mp4/file_example_MP4_1920_18MG.mp4',
      },
    ]);
  });
});
