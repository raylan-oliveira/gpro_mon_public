from flask import Flask, jsonify, request, Blueprint
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc, text

from datetime import date, datetime
from flask_security import auth_token_required
from server import app, db
from server.misc.functions import queryToJson

from server.database.model_estado import modelEstado

estadoBlueprint = Blueprint('estadoBlueprint', __name__)

@app.route("/api/estado", methods=['GET'])
@auth_token_required
def estados():
	listaestados = modelEstado.query.values(
		modelEstado.cod_estado,
		modelEstado.uf)
	return queryToJson(listaestados)

@app.route("/api/estado/<int:cod_estado>", methods=['GET'])
@auth_token_required
def estado(cod_estado):
	estadoselecionado = modelEstado.query.filter(modelEstado.cod_estado == cod_estado).values(
		modelEstado.cod_estado,
		modelEstado.uf)
	return queryToJson(estadoselecionado)


@app.route("/api/estado/<int:cod_estado>", methods=['DELETE'])
@auth_token_required
def deletarEstado(cod_estado):
	estado = {
		"visible" : 'False'
	}
	modelEstado.query.filter(modelEstado.cod_estado == cod_estado).update(estado)
	db.session.commit()
	msg = "Estado deletado com Sucesso!"
	return msg

@app.route("/api/estado", methods=['POST'])
@auth_token_required
def inserirEstado():
	uf = request.json.get('uf')
	visible = True

	estado = {
		"uf":uf,
		"visible": visible
	}
	addEstado = modelEstado(**estado)
	db.session.add(addEstado)
	db.session.commit()
	msg = "Estado cadastrado com sucesso!"
	return msg

@app.route("/api/estado/<int:cod_estado>", methods = ['PUT'])
@auth_token_required
def atualizarEstado(cod_estado):
	valores = request.json
	modelEstado.query.filter(modelEstado.cod_estado == cod_estado).update(valores)
	db.session.commit()
	msg = "Estado atualizado com sucesso!"
	return msg
