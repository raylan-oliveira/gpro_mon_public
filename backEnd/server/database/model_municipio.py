from server import db
from server.database.model_estado import modelEstado
class modelMunicipio(db.Model):
	__tablename__ ='municipio'
	cod_municipio = db.Column(db.Integer(), primary_key=True, autoincrement = True)
	descricao_municipio = db.Column(db.String(80))
	cod_estado = db.Column(db.Integer(), db.ForeignKey('estado.cod_estado'))
	visible = db.Column(db.Boolean())