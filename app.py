import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

app = Flask(__name__, static_folder='./build/static')


app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
from models import *

db.create_all()

userList = []
userCount = []
currTurn = ['X']
boardState = [None, None, None, None, None, None, None, None, None]

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
    
    try:
        boardState[data['move']] = data['turn']
        
        if data['turn'] == 'X':
            currTurn[0] = 'O'
        else:
            currTurn[0] = 'X'
            
    except:
        for i in range (len(boardState)):
            boardState[i] = None
    
    socketio.emit('move',  data, broadcast=True, include_self=False)
    
@socketio.on('login')
def add_user(data): 
    user = data['newUser']
    exists = db.session.query(Person.username).filter_by(username=user).first() is not None
    
    if not exists:
        rows = db.session.query(Person).count()
        newPerson = Person(username=user, score=100, rank=rows+1)
        db.session.add(newPerson)   
        db.session.commit()
        
    userList.append(user)
    
    if not userCount:
        userCount.append(1)
    else:
        userCount.append(userCount[(len(userCount) - 1)] + 1)
        
    socketio.emit('login',  {'userList': userList, 'userNum': userCount}, broadcast=True, include_self=True)
    
    
@socketio.on('logout')
def remove_user(data): 
    userList.remove(data['user'])
    userCount.pop()
    
    socketio.emit('logout',  {'userList': userList, 'userNum': userCount}, broadcast=True, include_self=True)


@socketio.on('get_leader_board')

def sendLB(data):
    query_obj = db.session.query(Person)
    desc_expression = sqlalchemy.sql.expression.desc(Person.score)
    
    order_by_query = query_obj.order_by(desc_expression)
    
    users = []
    score = []
    
    for person in order_by_query:
        users.append(person.username)
        score.append(person.score)
    
    socketio.emit('update_score', {'users': users, 'score': score})
    

@socketio.on('currentBoard')

def get_current_board():
    print("Requeust recieved");
    socketio.emit('currentBoard', {'board': boardState, 'turn': currTurn})
    
@socketio.on('changeStats')

def updateScore(data):
    updateWinner = Person.query.filter_by(username=data['winner']).first()
    updateLosser = Person.query.filter_by(username=data['losser']).first()
    
    updateWinner.score =  updateWinner.score + 1
    updateLosser.score =  updateLosser.score - 1
    
    print(updateWinner.score)
    print(updateLosser.score)
    
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