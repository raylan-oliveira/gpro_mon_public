from server import db, RoleMixin

class modelRole(db.Model, RoleMixin):

	__tablename__='role'
	id = db.Column(db.Integer(), primary_key=True)
	name = db.Column(db.String(80), unique=True)
	description = db.Column(db.String(255))