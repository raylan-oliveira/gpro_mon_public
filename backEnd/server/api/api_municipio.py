from flask import Flask, jsonify, request, Blueprint
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc, text

from datetime import date, datetime
from flask_security import auth_token_required
from server import app, db
from server.misc.functions import queryToJson

from server.database.model_municipio import modelMunicipio
from server.api.marshmallow_Schema.schemas import MunicipioSchema

municipio_schema = MunicipioSchema()
municipios_schema = MunicipioSchema(many=True)

def _list_all_municipios():
    
    consulta = modelMunicipio.query.filter(
        modelMunicipio.visible == True
        ).order_by(
            modelMunicipio.cod_municipio
                 ).values(
        modelMunicipio.cod_municipio,
        modelMunicipio.descricao_municipio,
    )
     
    dados = municipios_schema.dump(consulta)
    return dados

municipioBlueprint = Blueprint('municipioBlueprint', __name__)

@app.route("/api/municipio", methods=['GET'])
def municipios():
     
    dados = _list_all_municipios()
 
    return jsonify(dados)
    

@app.route("/api/municipio/<int:cod_municipio>", methods=['GET'])
@auth_token_required
def municipio(cod_municipio):
    municipio = modelMunicipio.query.filter(
        modelMunicipio.cod_municipio == cod_municipio).values(
            modelMunicipio.cod_municipio,
            modelMunicipio.descricao_municipio,
        )
    return queryToJson(municipio)

@app.route("/api/municipio/<int:cod_municipio>", methods=['DELETE'])
@auth_token_required
def deletarMunicipio(cod_municipio):
    municipio = {
        "visible":"False"
    }
    selectmunicipio = modelMunicipio.query.filter(modelMunicipio.cod_municipio == cod_municipio).update(municipio)
    db.session.commit()
    msg = "Município deletado com sucesso!"
    return msg

@app.route("/api/municipio", methods=['POST'])
@auth_token_required
def inserirMunicipio():
    visible = True
    cod_estado = 1
    lista = request.json.get('lista')
    for item in lista:
        cod_municipio = item['cod_municipio']
        descricao_municipio = item['cod_municipio']        
        municipio = {
            "cod_municipio": cod_municipio,
            "descricao_municipio": descricao_municipio,
            "cod_estado": cod_estado,
            "visible": visible
        }
        addMunicipio = modelMunicipio(**municipio)
        db.session.add(addMunicipio)
    
    db.session.commit()
    msg = "Municipios cadastrado com sucesso!"
    return msg

@app.route("/api/municipio/<int:cod_municipio>", methods = ['PUT'])
@auth_token_required
def atualizarMunicipio(cod_municipio):
    valores = request.json
    modelMunicipio.query.filter(modelMunicipio.cod_municipio == cod_municipio).update(valores)
    db.session.commit()
    msg = "Municipio atualizado com sucesso!"
    return msg
