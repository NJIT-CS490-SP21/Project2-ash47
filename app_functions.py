import os
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy
from dotenv import load_dotenv, find_dotenv

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

def swap_turn(turn):
    if turn == "X":
        return "O"
    elif turn == "O":
        return "X"
    else:
        return None
        
def reset(board, turn):
    for i in range(len(board)):
        board[i] = None
    turn[0] = 'X'
    return board, turn

def update_board(board, turn, data):
    try:
        board[data["move"]] = data["turn"]

        turn[0] = swap_turn(data["turn"])

    except KeyError:
        board, turn = reset(board, turn)
    return board, turn
    
def check_user(user):
    return DB.session.query(Person.username).filter_by(username=user).first() is not None
    
def add_new_user(user):
    rows = DB.session.query(Person).count()
    new_person = Person(username=user, score=100, rank=rows + 1)
    DB.session.add(new_person)
    DB.session.commit()
    
def get_score():
    query_obj = DB.session.query(Person)
    desc_expression = sqlalchemy.sql.expression.desc(Person.score)
    order_by_query = query_obj.order_by(desc_expression)
    return order_by_query
    
def update_winner_score(data):
    update_winner = Person.query.filter_by(username=data["winner"]).first()
    update_losser = Person.query.filter_by(username=data["losser"]).first()

    update_winner.score = update_winner.score + 1
    update_losser.score = update_losser.score - 1

    DB.session.commit()
    
    return get_score()

def get_score_list(user_score):
    users = []
    score = []

    for person in user_score:
        users.append(person.username)
        score.append(person.score)
        
    return users, score
