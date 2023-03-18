from server import db

class modelUsuarioConfigAtivacao(db.Model):
    __tablename__ ='usuario_config_ativacao'
    cod_usuario_config_ativacao = db.Column(db.Integer(), primary_key=True, autoincrement = True)
    descricao_usuario_config_ativacao = db.Column(db.String(120))
    cod_ativacao = db.Column(db.String(60), unique=True)
    id_usuario_ativacao_criador = db.Column(db.Integer())
    permissao_padrao_user = db.Column(db.Integer(), db.ForeignKey('permissao_user.cod_permissao_user'))
    data_criacao = db.Column(db.DateTime())
    visible = db.Column(db.Boolean())