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
    with open('../videos/test.webm', 'rb') as ts:
        for i in range(4):
            emit('stream', {'data': ts.read()}, broadcast=True)


if __name__ == '__main__':
    socketio.run(app)
