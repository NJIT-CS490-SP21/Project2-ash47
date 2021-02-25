import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS

userList = []
userCount = []


app = Flask(__name__, static_folder='./build/static')

cors = CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    print('User connected!')

# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    print('User disconnected!')

@socketio.on('move')
def on_move(data): 
    
    socketio.emit('move',  data, broadcast=True, include_self=False)
    
@socketio.on('login')
def add_user(data): 
    userList.append(data['newUser'])
    
    if not userCount:
        userCount.append(1)
    else:
        userCount.append(userCount[(len(userCount) - 1)] + 1)
        
    print(userList)
    print(userCount)
    socketio.emit('login',  {'userList': userList, 'userNum': userCount}, broadcast=True, include_self=True)
    
    
@socketio.on('logout')
def remove_user(data): 
    userList.remove(data['user'])
    userCount.pop()
    
    print(userList)
    print(userCount)
    socketio.emit('logout',  {'userList': userList, 'userNum': userCount}, broadcast=True, include_self=True)

# Note that we don't call app.run anymore. We call socketio.run with app arg
socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)