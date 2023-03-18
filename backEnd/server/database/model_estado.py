from server import db

class modelEstado(db.Model):
	__tablename__ ='estado'
	cod_estado = db.Column(db.Integer(), primary_key=True)
	uf = db.Column(db.String(2))
	visible = db.Column(db.Boolean())
