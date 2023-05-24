# Plex Transcoder

Transcodes all media in media folder to reduce the need for plex to transcode during playback

Based on great lib [BrianDMG/conv2mp4-py](https://github.com/BrianDMG/conv2mp4-py)

## ssh files to/from nas

```bash
scp -r qnapAdmin@192.168.0.227:/share/CACHEDEV1_DATA/plex/movies/Minions The Rise of Gru (2022) ./movies

scp -r ./tests/media/avi qnapAdmin@192.168.0.227:/share/CACHEDEV1_DATA/plex/movies/2Convert
```

## check encoding

```bash
ffmpeg -i ./tests/media/avi/file_example_AVI_1920_2_3MG.avi
ffmpeg -i ./tests/media/avi/Test.avi
ffmpeg -i ./tests/media/avi/Plex\ Versions/Optimized\ for\ TV/Test\ -\ 1080.mp4
ffmpeg -i ./tests/media/avi/Plex\ Versions/Optimized\ for\ Mobile/Test\ -\ 720.mp4


ffmpeg -i ./tests/movie/Minions.mp4
ffmpeg -i ./tests/movie/Plex\ Versions/Optimized\ for\ TV/Minions\ -\ 1080.mp4
ffmpeg -i ./tests/movie/Plex\ Versions/Optimized\ for\ Mobile/Minions\ -\ 720.mp4

```

## Flow

Build state
Process state

Build state

- Walk folder and find media file
- If file doesn't exist in state, add it
- If file exist in state, skip it
- If file exist in state but not in file system, remove it from state
- If optimized folder exist and doesn't exist in state, add it
- If optimized folder exist and exist in state, skip it
- If optimized folder doesn't exist but exist in state, remove it from state

Process state

- Loop through state files
- If ignore, skip
- If optimized exist, skip
- If optimized doesn't exist, optimize

Optimize

- Make optimized dir
- Transcode media
- Extract metadata
- Update state
