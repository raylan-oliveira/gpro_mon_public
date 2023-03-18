from server import db

class modelAutuacao(db.Model):
    __tablename__ ='autuacao'
    cod_autuacao = db.Column(db.Integer(), primary_key=True)
    n_processo = db.Column(db.String(30))
    coordenada = db.Column(db.Text())
    id_alerta = db.Column(db.String(30))
    nome_autuado = db.Column(db.String(100))
    nome_imovel = db.Column(db.String(100))
    cpf = db.Column(db.String(30))    
    cod_infracao = db.Column(db.Integer(), db.ForeignKey('infracao.cod_infracao'))
    n_auto_infracao = db.Column(db.Integer)
    area_imovel = db.Column(db.Float())
    serie_auto_infracao = db.Column(db.String(50))
    localizacao_imovel = db.Column(db.Text())
    cod_municipio = db.Column(db.Integer(), db.ForeignKey('municipio.cod_municipio'))
    descricao_sancao_aplicada = db.Column(db.Text())
    termo_compromisso = db.Column(db.String(20))
    zona = db.Column(db.String(50))
    monitoramento_embargo = db.Column(db.String(50))
    data_embargo = db.Column(db.DateTime())
    fiscal = db.Column(db.Text())
    data_criacao = db.Column(db.DateTime())
    visible = db.Column(db.Boolean())
    cod_usuario = db.Column(db.Integer(), db.ForeignKey('usuario.id'))
    
 
