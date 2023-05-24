export enum ConvertToEnum {
  to1080 = 'to1080',
  to720 = 'to720',
}

export type MediaFile = {
  path: string;
  name: string;
  extension: string;
};

export type StateFile = MediaFile & {
  processed: boolean;
  error?: string;
  ignore: boolean;
  transcoded: {
    to1080?: number;
    to720?: number;
  };
  metadata: {
    original?: FFMpegMetaData;
    to1080?: FFMpegMetaData;
    to720?: FFMpegMetaData;
  };
};

export type FFMpegMetaData = {
  filename: string;
  title: string;
  artist: string;
  album: string;
  track: string;
  date: string;
  synched: boolean;
  duration: {
    raw: string;
    seconds: number;
  };
  video: {
    container: string;
    bitrate: number;
    stream: number;
    codec: string;
    resolution: {
      w: number;
      h: number;
    };
    resolutionSquare: {
      w: number;
      h: number;
    };
    aspect: {
      x: number;
      y: number;
      string: string;
      value: number;
    };
    rotate: number;
    fps: number;
    pixelString: string;
    pixel: number;
  };
  audio: {
    codec: string;
    bitrate: string;
    sample_rate: number;
    stream: number;
    channels: {
      raw: string;
      value: number;
    };
  };
};
