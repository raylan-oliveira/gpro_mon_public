from server import db, UserMixin
from server.database.model_role import modelRole

roles_users = db.Table('roles_users',
    db.Column('user_id', db.Integer(), db.ForeignKey('usuario.id')),
    db.Column('role_id', db.Integer(), db.ForeignKey('role.id')))

class modelUsuario(db.Model, UserMixin):
    __tablename__ = 'usuario'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    email = db.Column(db.String(255), unique=True)
    active = db.Column(db.Boolean())
    password = db.Column(db.String(255))
    tema = db.Column(db.String(50))
    cod_permissao_user = db.Column(db.Integer(), db.ForeignKey('permissao_user.cod_permissao_user'))
    cod_usuario_config_ativacao = db.Column(db.Integer(), db.ForeignKey('usuario_config_ativacao.cod_usuario_config_ativacao'))
    cod_orgao = db.Column(db.Integer(), db.ForeignKey('orgao.cod_orgao'))
    id_usuario_ativou = db.Column(db.Integer())
    id_usuario_desativou = db.Column(db.Integer())
    status_ultima_movimentacao = db.Column(db.String(10))
    data_ultima_movimentacao = db.Column(db.DateTime())
    confirmed_at = db.Column(db.DateTime())
    roles = db.relationship('modelRole', secondary=roles_users,
                            backref=db.backref('modelUsuario', lazy='dynamic'))
