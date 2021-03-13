from app import DB

class Person(DB.Model):
    username = DB.Column(DB.String(80), primary_key=True)
    score = DB.Column(DB.Integer, unique=False, nullable=False)
    rank = DB.Column(DB.Integer, unique=True, nullable=False)

    def __repr__(self):
        return '<Person %r>' % self.username