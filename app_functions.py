""" Support function file for app.py """
import os
from flask import Flask
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
    """ This function updates swap user turn """
    if turn == "X":
        return "O"
    elif turn == "O":
        return "X"
    else:
        return None


def reset(board, turn):
    """ This function resets game baord """
    for i in range(len(board)):
        board[i] = None
    turn[0] = 'X'
    return board, turn


def update_board(board, turn, data):
    """ This function updates board """
    try:
        board[data["move"]] = data["turn"]

        turn[0] = swap_turn(data["turn"])

    except KeyError:
        board, turn = reset(board, turn)
    return board, turn


def check_user(user):
    """ This function check if user already in database """
    return DB.session.query(
        Person.username).filter_by(username=user).first() is not None


def add_new_user(user):
    """ This function adds user to db """
    rows = DB.session.query(Person).count()
    new_person = Person(username=user, score=100, rank=rows + 1)
    DB.session.add(new_person)
    DB.session.commit()

    all_people = Person.query.all()
    users = []
    for person in all_people:
        users.append(person.username)
    return users


def get_score():
    """ This function gets score database from db """
    query_obj = DB.session.query(Person)
    desc_expression = sqlalchemy.sql.expression.desc(Person.score)
    order_by_query = query_obj.order_by(desc_expression)
    return order_by_query


def update_winner_score(data):
    """ This function updates winner score in db """
    update_winner = Person.query.filter_by(username=data["winner"]).first()
    update_losser = Person.query.filter_by(username=data["losser"]).first()

    update_winner.score = update_winner.score + 1
    update_losser.score = update_losser.score - 1

    DB.session.commit()

    return get_score()


def get_score_list(user_score):
    """ This function sends back sorted users list and scores list """
    users = []
    score = []

    for person in user_score:
        users.append(person.username)
        score.append(person.score)

    return users, score
