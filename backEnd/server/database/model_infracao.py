from server import db
from server.database.model_estado import modelEstado
class modelInfracao(db.Model):
	__tablename__ ='infracao'
	cod_infracao = db.Column(db.Integer(), primary_key=True, autoincrement = True)
	descricao_infracao = db.Column(db.String(80))
	visible = db.Column(db.Boolean())