from server import db

class modelPermissaoUser(db.Model):
    __tablename__ ='permissao_user'
    cod_permissao_user = db.Column(db.Integer(), primary_key=True, autoincrement = True)
    descricao_permissao_user = db.Column(db.String(80))
    atributos_permissao_user = db.Column(db.Text())
    visible = db.Column(db.Boolean())