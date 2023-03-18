from flask import Flask, jsonify, request, Blueprint
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc, text

from datetime import date, datetime
from flask_security import auth_token_required
from server import app, db
from server.misc.functions import queryToJson

from server.database.model_infracao import modelInfracao
from server.api.marshmallow_Schema.schemas import InfracaoSchema

infracao_schema = InfracaoSchema()
infracoes_schema = InfracaoSchema(many=True)

def _list_all_infracoes():
    
    consulta = modelInfracao.query.filter(
        modelInfracao.visible == True
        ).order_by(
            modelInfracao.cod_infracao
                 )
     
    dados = infracoes_schema.dump(consulta)
    return dados

infracaoBlueprint = Blueprint('infracaoBlueprint', __name__)

@app.route("/api/infracao", methods=['GET'])
@auth_token_required
def infracoes():
    
    dados = _list_all_infracoes()
 
    return jsonify(dados)

@app.route("/api/infracao/<int:cod_infracao>", methods=['GET'])
@auth_token_required
def infracao(cod_infracao):
    infracao = modelInfracao.query.filter(
        modelInfracao.cod_infracao == cod_infracao).values(
            modelInfracao.cod_infracao,
            modelInfracao.descricao_infracao,
        )
    return queryToJson(infracao)

@app.route("/api/infracao/<int:cod_infracao>", methods=['DELETE'])
@auth_token_required
def deletarinfracao(cod_infracao):
    infracao = {
        "visible":"False"
    }
    selectinfracao = modelInfracao.query.filter(modelInfracao.cod_infracao == cod_infracao).update(infracao)
    db.session.commit()
    msg = "Município deletado com sucesso!"
    return msg

@app.route("/api/infracao", methods=['POST'])
@auth_token_required
def inseririnfracao():
    visible = True
    cod_estado = 1
    lista = request.json.get('lista')
    for item in lista:
        cod_infracao = item['cod_infracao']
        descricao_infracao = item['cod_infracao']        
        infracao = {
            "cod_infracao": cod_infracao,
            "descricao_infracao": descricao_infracao,
            "cod_estado": cod_estado,
            "visible": visible
        }
        addinfracao = modelInfracao(**infracao)
        db.session.add(addinfracao)
    
    db.session.commit()
    msg = "infracoes cadastrado com sucesso!"
    return req

@app.route("/api/infracao/<int:cod_infracao>", methods = ['PUT'])
@auth_token_required
def atualizarinfracao(cod_infracao):
    valores = request.json
    modelInfracao.query.filter(modelInfracao.cod_infracao == cod_infracao).update(valores)
    db.session.commit()
    msg = "infracao atualizado com sucesso!"
    return msg
