import os
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

app = Flask(__name__, static_folder='./build/static')   # pylint: disable=C0103


app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)    # pylint: disable=C0103

# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
from models import *    # pylint: disable=wrong-import-position, wildcard-import

db.create_all()

USER_LIST = []
USER_COUNT = []
CURR_TURN = ['X']
BOARD_STATE = [None, None, None, None, None, None, None, None, None]

cors = CORS(app, resources={r"/*": {"origins": "*"}})   # pylint: disable=C0103

socketio = SocketIO(    # pylint: disable=C0103
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

    try:
        BOARD_STATE[data['move']] = data['turn']

        if data['turn'] == 'X':
            CURR_TURN[0] = 'O'
        else:
            CURR_TURN[0] = 'X'

    except KeyError:
        for i in range(len(BOARD_STATE)):
            BOARD_STATE[i] = None

    socketio.emit('move', data, broadcast=True, include_self=False)

# When a clinet logs in this function:
# 1. Checks if Client's user id is already in database if not then add it
# 2. Add the client's user id to active user list
@socketio.on('login')
def add_user(data):
    user = data['newUser']
    exists = db.session.query(Person.username).filter_by(username=user).first() is not None

    if not exists:
        rows = db.session.query(Person).count()
        new_person = Person(username=user, score=100, rank=rows+1)
        db.session.add(new_person)
        db.session.commit()

    USER_LIST.append(user)

    if not USER_COUNT:
        USER_COUNT.append(1)
    else:
        USER_COUNT.append(USER_COUNT[(len(USER_COUNT) - 1)] + 1)

    socketio.emit('login', {'userList': USER_LIST, 'userNum': USER_COUNT}, broadcast=True, include_self=True)     # pylint: disable=line-too-long

# When a client logs out this function remove client's user id from active user list
@socketio.on('logout')
def remove_user(data):
    USER_LIST.remove(data['user'])
    USER_COUNT.pop()

    socketio.emit('logout', {'userList': USER_LIST, 'userNum': USER_COUNT}, broadcast=True, include_self=True)    # pylint: disable=line-too-long


# This function sends leader board / db table upon client's request
@socketio.on('get_leader_board')
def send_leader_board(data):
    query_obj = db.session.query(Person)
    desc_expression = sqlalchemy.sql.expression.desc(Person.score)

    order_by_query = query_obj.order_by(desc_expression)

    users = []
    score = []

    for person in order_by_query:
        users.append(person.username)
        score.append(person.score)

    socketio.emit('update_score', {'users': users, 'score': score})


# This function sends current board (list) upon client's request
@socketio.on('currentBoard')

def get_current_board():
    print("Requeust recieved")
    socketio.emit('currentBoard', {'board': BOARD_STATE, 'turn': CURR_TURN})

# This function updates scores for winner and looser in db
@socketio.on('changeStats')
def update_score(data):
    update_winner = Person.query.filter_by(username=data['winner']).first()
    update_losser = Person.query.filter_by(username=data['losser']).first()

    update_winner.score = update_winner.score + 1
    update_losser.score = update_losser.score - 1

    db.session.commit()

    query_obj = db.session.query(Person)
    desc_expression = sqlalchemy.sql.expression.desc(Person.score)

    order_by_query = query_obj.order_by(desc_expression)

    users = []
    score = []

    for person in order_by_query:
        users.append(person.username)
        score.append(person.score)

    socketio.emit('update_score', {'users': users, 'score': score})


# Note that we don't call app.run anymore. We call socketio.run with app arg
if __name__ == "__main__":
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
