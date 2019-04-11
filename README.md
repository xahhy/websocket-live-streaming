# WebSocket TS Steaming

## 本地测试注意事项

- 在`videos`文件夹下包含所有视频文件
- 目前仅测试成功`VP8`编码的`webm`格式的视频文件

## 开发测试流程

### 搭建WebSocket服务器

本项目使用`Python3.6`,使用技术有: Flask, Flask-SocketIO, Flask-CORS

- `cd`进入到`python`文件夹中
- 确保系统安装了virtualenv (保护系统Python环境不被污染)
- 执行`virtualenv env`初始化python virtualenv环境
- 执行`source env/bin/activate`激活环境 (执行`deactivate`退出环境)
- 执行`pip install -r requirements.txt`安装所需依赖
- 执行`./start.sh`运行WebSocket服务 (默认端口5000)

### 运行网页

在浏览器打开`frontend/index.html`即可本地调试

### 常见问题

- 网页无法正常播放视频

> 打开浏览器终端, 看看有没有错误
> 确保WebSocket服务器正常运行在5000端口

## 如何将MP4文件拆分成多个TS流文件

- 使用`ffmpeg`工具将视频文件切分成多个TS流文件

> `ffmpeg -i input.mp4 -bsf:v h264_mp4toannexb -codec copy -hls_list_size 0 output.m3u8`