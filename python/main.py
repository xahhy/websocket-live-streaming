from time import sleep

from flask import Flask, render_template
from flask_socketio import SocketIO,send,emit
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SECREAT_KEY'] = 'secret!'
socketio = SocketIO(app)


@socketio.on('message')
def handle_message(message):
    print('received message is', message)


@socketio.on('video')
def handle_video():
    with open('../videos/gapless.webm', 'rb') as ts:
        data = ts.read()
        while True:
            emit('stream', {'data': data}, broadcast=True)
            sleep(6)


if __name__ == '__main__':
    socketio.run(app)
