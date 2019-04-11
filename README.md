# WebSocket TS Steaming

## 本地测试注意事项

- 在`videos`文件夹下包含所有`ts`视频流文件`outputxxx.ts`

## 如何将MP4文件拆分成多个TS流文件

- 使用`ffmpeg`工具将视频文件切分成多个TS流文件

> `ffmpeg -i input.mp4 -bsf:v h264_mp4toannexb -codec copy -hls_list_size 0 output.m3u8`