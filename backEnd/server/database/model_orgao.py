from server import db

class modelOrgao(db.Model):
	__tablename__ ='orgao'
	cod_orgao = db.Column(db.Integer(), primary_key=True, autoincrement = True)
	descricao_orgao = db.Column(db.String(120))
	sigla_orgao = db.Column(db.String(80))
	permissao_padrao_user = db.Column(db.Integer(), db.ForeignKey('permissao_user.cod_permissao_user'))
	visible = db.Column(db.Boolean())