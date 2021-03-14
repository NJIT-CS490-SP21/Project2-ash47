""" Server for tic tac toe app """
import os
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy
from dotenv import load_dotenv, find_dotenv
from app_functions import *

load_dotenv(find_dotenv())

APP = Flask(__name__, static_folder="./build/static")


APP.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
# Gets rid of a warning
APP.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

DB = SQLAlchemy(APP)

# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
from models import *  # pylint: disable=wrong-import-position, wildcard-import

DB.create_all()

USER_LIST = []
USER_COUNT = []
CURR_TURN = ["X"]
BOARD_STATE = [None, None, None, None, None, None, None, None, None]
USER_CHAT = []

cors = CORS(APP, resources={r"/*": {"origins": "*"}})  # pylint: disable=C0103

socketio = SocketIO(  # pylint: disable=C0103
    APP, cors_allowed_origins="*", json=json, manage_session=False
)


@APP.route("/", defaults={"filename": "index.html"})
@APP.route("/<path:filename>")
def index(filename):
    """ return file """
    return send_from_directory("./build", filename)


# When a client connects from this Socket connection, this function is run
@socketio.on("connect")
def on_connect():
    """ When a client connects from this Socket connection, this function is run  """
    print("User connected!")


# When a client disconnects from this Socket connection, this function is run
@socketio.on("disconnect")
def on_disconnect():
    """ When a client disconnects from this Socket connection, this function is run """
    print("User disconnected!")


@socketio.on("move")
def on_move(data):

    """ This function stores current board data into lits, and emit it back """
    global BOARD_STATE, CURR_TURN
    
    BOARD_STATE, CURR_TURN = update_board(BOARD_STATE, CURR_TURN, data)
    
    socketio.emit("move", data, broadcast=True, include_self=False)


# When a clinet logs in this function:
# 1. Checks if Client's user id is already in database if not then add it
# 2. Add the client's user id to active user list
@socketio.on("login")
def add_user(data):

    """When a clinet logs in this function:
    1. Checks if Client's user id is already in database if not then add it
    2. Add the client's user id to active user list
    """
    user = data["newUser"]
    
    exists = check_user(user)
    
    if not exists:
        add_new_user(user)
    Person.query.all()

    USER_LIST.append(user)

    if not USER_COUNT:
        USER_COUNT.append(1)
    else:
        USER_COUNT.append(USER_COUNT[(len(USER_COUNT) - 1)] + 1)
    
    socketio.emit(
        "login",
        {"userList": USER_LIST, "userNum": USER_COUNT},
        broadcast=True,
        include_self=True,
    )  # pylint: disable=line-too-long


# When a client logs out this function remove client's user id from active user list
@socketio.on("logout")
def remove_user(data):

    """When a client logs out this function remove client's user id from active user list"""

    USER_LIST.remove(data["user"])
    USER_COUNT.pop()

    socketio.emit(
        "logout",
        {"userList": USER_LIST, "userNum": USER_COUNT},
        broadcast=True,
        include_self=True,
    )  # pylint: disable=line-too-long


# This function sends leader board / DB table upon client's request
@socketio.on("get_leader_board")
def send_leader_board(data):

    """ This function sends leader board / DB table upon client's request """
    
    user_score = get_score()
    
    users, score = get_score_list(user_score)
    
    socketio.emit("update_score", {"users": users, "score": score})


# This function sends current board (list) upon client's request
@socketio.on("currentBoard")
def get_current_board():

    """ This function sends current board (list) upon client's request """

    socketio.emit("currentBoard", {"board": BOARD_STATE, "turn": CURR_TURN})


@socketio.on("currentChat")
def get_current_chat(data):
    """ Send previous chat board upon user request """
    socketio.emit(
        "currentChat", {"board": USER_CHAT}, broadcast=True, include_self=True
    )


# This function updates scores for winner and looser in DB
@socketio.on("changeStats")
def update_score(data):
    """ This function updates scores for winner and looser in DB """
    user_score = update_winner_score(data)
    users, score = get_score_list(user_score)
    socketio.emit("update_score", {"users": users, "score": score})


# When a client logs out this function remove client's user id from active user list
@socketio.on("chat")
def user_chat(data):
    """ When a client logs out this function remove client's user id from active user list """
    USER_CHAT.append(data["chat"])
    if len(USER_CHAT) > 50:
        USER_CHAT.pop(0)
    socketio.emit(
        "chat", data, broadcast=True, include_self=False
    )


# Note that we don't call app.run anymore. We call socketio.run with app arg
if __name__ == "__main__":

    socketio.run(
        APP,
        host=os.getenv("IP", "0.0.0.0"),
        port=8081
        if os.getenv("C9_PORT")
        else int(os.getenv("PORT", 8081)),  # pylint: disable=invalid-envvar-default
    )
