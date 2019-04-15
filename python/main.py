from time import sleep

from flask import Flask, render_template
from flask_socketio import SocketIO,send,emit
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SECREAT_KEY'] = 'secret!'
socketio = SocketIO(app)

should_send_video = True

@socketio.on('message')
def handle_message(message):
    print('received message is', message)

@socketio.on('connect')
def handle_connect():
    print('connected')
    should_send_video = True

@socketio.on('disconnect')
def handle_disconnect():
    print('disconnected')
    should_send_video = False

@socketio.on('video')
def handle_video():
    # with open('../videos/gapless.webm', 'rb') as ts:
    with open('../videos/frag_bunny.mp4', 'rb') as ts:
        # data = ts.read(1024)
        # while len(data) != 0:
        #     data = ts.read(1024)
        data = ts.read()
        while should_send_video and len(data) != 0:
            print('send video bytes')
            emit('stream', {'data': data}, broadcast=True)
            sleep(10)
        print('Stop steaming!')


if __name__ == '__main__':
    print("Starting websocket server")
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
