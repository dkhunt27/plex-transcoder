import { MediaFile, StateFile } from '../src/types.js';
import { updateStateWithCurrentFileList } from '../src/utilities.js';

describe('utilities', () => {
  describe('updateStateWithCurrentFileList', () => {
    let files: MediaFile[], state: StateFile[];
    beforeEach(() => {
      files = [
        {
          extension: '.abc',
          name: 'file1.abc',
          path: '/some/path/file1.abc',
        },
        {
          extension: '.abc',
          name: 'file2.abc',
          path: '/some/path/file2.abc',
        },
      ];
      state = [
        {
          extension: '.abc',
          name: 'file1.abc',
          path: '/some/path/file1.abc',
          processed: false,
          ignore: false,
          transcoded: {},
          metadata: {},
        },
      ];
    });
    it('when file and state populates', () => {
      const actual = updateStateWithCurrentFileList({
        files,
        prevState: state,
      });
      expect(actual).toEqual([
        {
          extension: '.abc',
          ignore: false,
          name: 'file1.abc',
          path: '/some/path/file1.abc',
          processed: false,
          transcoded: { to1080: false, to720: false },
        },
        {
          extension: '.abc',
          ignore: false,
          name: 'file2.abc',
          path: '/some/path/file2.abc',
          processed: false,
          transcoded: { to1080: false, to720: false },
        },
      ]);
    });
  });
});
