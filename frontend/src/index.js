import io from "socket.io-client";
import {
  addClass,
  removeClass
} from './utils/common';

document.addEventListener('DOMContentLoaded', function () {
  const PORT = 5000;
  const DOMAIN = "127.0.0.1"
  var socket;
  var segments = [];
  var buffer;
  var DisconnectBtn = document.getElementById('disconnectBtn');
  var ConnectBtn = document.getElementById('connectBtn');
  var SocketStatus = document.querySelector('.socket-status');

  function RawDataToUint8Array(rawData) {
    // 12,4 = mfhd;20,4 slice - segment.id;36,4 = tfhd;44,4 slice - track.id;64,4 = tfdt
    // 72,8 slice - prestime;84,4 = futc;92,8 slice - real utc;104,4 = trun
    const result = new Uint8Array(rawData)
    return result
  }

  function getTrackId(data) {
    return data[47]
  }

  function rawDataToSegment(rawData) {
    const view = RawDataToUint8Array(rawData)
    const trackId = getTrackId(view)
    console.log('trackId:', trackId);
    // const trackType = getTypeBytrackId(trackId)
    return {
      type: trackId,
      data: view
    }
  }

  function procArrayBuffer(rawData) {
    const segment = rawDataToSegment(rawData);
    segments.push(segment);

    if (buffer.updating) {
      segments.unshift(segment)
    } else {
      buffer.appendBuffer(segment.data)
    }
  }


  var video = document.querySelector('video');
  // var mimeCodec = 'video/webm; codecs="vorbis,vp8"';
  const mimeCodec = 'video/mp4;codecs="avc1.42E01E,mp4a.40.2"';
  if (MediaSource.isTypeSupported(mimeCodec)) {
    // Create Media Source
    var mediaSource = new MediaSource(); // mediaSource.readyState === 'closed'
    video.src = URL.createObjectURL(mediaSource);
    mediaSource.addEventListener('sourceopen', sourceOpen);
  } else {
    console.error("Unsupported media format");
  }

  function sourceOpen(_) {
    console.log("init socketio");
    initSocketIO();
    var mediaSource = this;
    buffer = mediaSource.addSourceBuffer(mimeCodec);
    console.log('default source buffer mode:', buffer.mode);
    buffer.mode = 'sequence';
    console.log('set source buffer mode to "sequrence"');

    buffer.addEventListener('updateend', function (e) {
      console.log('updateend: ' + mediaSource.readyState);
    });
    buffer.addEventListener('updatestart', function (e) {
      console.log('updatestart: ' + mediaSource.readyState);
    });
    buffer.addEventListener('update', function (e) {
      console.log('update: ' + mediaSource.readyState);
    });
    buffer.addEventListener('updateend', function (e) {
      console.log('updateend: ' + mediaSource.readyState);
    });
    buffer.addEventListener('error', function (e) {
      console.log('error: ' + mediaSource.readyState);
    });
    buffer.addEventListener('abort', function (e) {
      console.log('abort: ' + mediaSource.readyState);
    });

  }

  function initSocketIO() {
    socket = io.connect('http://' + DOMAIN + ':' + PORT, {
      rememberTransport: false,
      reconnection: false
      // transports: ['websocket']
    });
    socket.on('connect', function () {
      socket.emit('message', {
        data: 'I\'m connected!'
      });
      addClass(SocketStatus, 'connected')
      removeClass(SocketStatus, 'disconnected');
    });

    socket.on('disconnect', function () {
      addClass(SocketStatus, 'disconnected')
      removeClass(SocketStatus, 'connected');
    })
    socket.on('stream', function (data) {
      console.log("Receive stream data", data);
      procArrayBuffer(data.data);
    });
  }

  document.getElementById("triggerBtn").addEventListener('click', e => {
    socket.emit("video");
    video.play();
  })

  DisconnectBtn.addEventListener('click', e => {
    socket.disconnect();
  })

  ConnectBtn.addEventListener('click', e => {
    socket.connect();
  })
})