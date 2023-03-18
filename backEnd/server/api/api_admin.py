from flask import Flask, jsonify, request, Blueprint
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc, text, asc, or_
from flask_login import current_user
from datetime import datetime
from server.misc.functions import queryToJson, check_permission_admin

from flask_security import auth_token_required

from server import app, db
from server.misc.functions import queryToJson

from server.database.model_usuario import modelUsuario
from server.database.model_orgao import modelOrgao
from server.database.model_permissao_user import modelPermissaoUser
from server.database.model_usuario_config_ativacao import modelUsuarioConfigAtivacao

from server.api.marshmallow_Schema.schemas import UsuarioSchema, OrgaoSchema

from server.api.marshmallow_Schema.schemas import PermissaoUserSchema

permissao_user_schema = PermissaoUserSchema()
permissoes_user_schema = PermissaoUserSchema(many=True)

def _list_permissoes():
    
    consulta = modelPermissaoUser.query.filter(
        modelPermissaoUser.visible == True
        ).order_by(
            modelPermissaoUser.cod_permissao_user
                 )
     
    dados = permissoes_user_schema.dump(consulta)
    print(dados)
    return dados

adminBlueprint = Blueprint('adminBlueprint', __name__)

@app.route("/api/admin/desativar_cod/<int:id_cod>", methods = ['DELETE'])
@auth_token_required
@check_permission_admin
def desativar_cod(id_cod):
    
    dict_update = {"visible": False} 
   
    modelUsuarioConfigAtivacao.query.filter(modelUsuarioConfigAtivacao.cod_usuario_config_ativacao == id_cod).update(dict_update)
    db.session.commit()    
    
    return jsonify('Código Desativado com sucesso.'),200

@app.route('/api/admin/pesquisa_cod', methods=['POST'])
@auth_token_required
@check_permission_admin
def pesquisar_cod():    
    
    try:
        pesquisa = request.json.get('input')
    except:
        pesquisa = ''
    if pesquisa == None:
        pesquisa = ''
    
    print(pesquisa)
    # pesquisa sem parametro
    resultQuery = modelUsuarioConfigAtivacao.query.filter(
        modelUsuarioConfigAtivacao.id_usuario_ativacao_criador == current_user.id,
        modelUsuarioConfigAtivacao.visible == True,
        or_(modelUsuarioConfigAtivacao.cod_ativacao.ilike('%'+pesquisa+'%')
        ),
        ).order_by(
            desc(modelUsuarioConfigAtivacao.cod_usuario_config_ativacao)
        ).join(
        modelPermissaoUser,
        modelPermissaoUser.cod_permissao_user == modelUsuarioConfigAtivacao.permissao_padrao_user
    ).values(
        modelUsuarioConfigAtivacao.cod_usuario_config_ativacao,
        modelUsuarioConfigAtivacao.descricao_usuario_config_ativacao,
        modelUsuarioConfigAtivacao.cod_ativacao,
        modelUsuarioConfigAtivacao.permissao_padrao_user,
        modelPermissaoUser.atributos_permissao_user,
        modelUsuarioConfigAtivacao.data_criacao,
    ) 
    
    
    return queryToJson(resultQuery)


@app.route("/api/codigo_ativacao", methods=['POST'])
@auth_token_required
@check_permission_admin
def inserirCodigoAtivacao():
    
    print(request.json)   
       
    
    descricao_usuario_config_ativacao = request.json.get('descricao_usuario_config_ativacao')
    cod_ativacao = request.json.get('codigo_gerado')
    permissao_padrao_user = request.json.get('cod_permissao_user')    
    
    id_usuario_ativacao_criador = current_user.id
    
    data_criacao = datetime.now()
    
    visible = True     
    
    valores= {
            "descricao_usuario_config_ativacao": descricao_usuario_config_ativacao,
            "cod_ativacao": cod_ativacao,
            "permissao_padrao_user": permissao_padrao_user,
            "id_usuario_ativacao_criador": id_usuario_ativacao_criador,
            "id_usuario_ativacao_criador": id_usuario_ativacao_criador,
            "data_criacao": data_criacao,
            "visible": visible
            }
    addConfig = modelUsuarioConfigAtivacao(**valores)
    db.session.add(addConfig)
    db.session.commit() 
    msg = "Código Salvo com sucesso!"
    return msg


@app.route("/api/atualizar_permissao/<int:id>", methods = ['PUT'])
@auth_token_required
@check_permission_admin
def atualizarPermissaoUser(id):
    cod_permissao_user = request.json.get('cod_permissao_user')
    data_ultima_movimentacao = datetime.now()
   
    valores= {"cod_permissao_user": cod_permissao_user,
                   "status_ultima_movimentacao": "permissao",
                   "data_ultima_movimentacao": data_ultima_movimentacao
                   } 
    modelUsuario.query.filter(modelUsuario.id == id).update(valores)
    db.session.commit()
    return ('Sucesso', 200)

@app.route("/api/permissao", methods=['GET'])
@auth_token_required
@check_permission_admin
def permissoes():
    
    dados = _list_permissoes()
 
    return jsonify(dados)

@app.route('/api/admin/pesquisa_user', methods=['POST'])
@auth_token_required
@check_permission_admin
def pesquisar_usuario():    
    
    try:
        pesquisa = request.json.get('input')
    except:
        pesquisa = ''
    if pesquisa == None:
        pesquisa = ''
    
    print(pesquisa)
    # pesquisa sem parametro
    resultQuery = modelUsuario.query.filter(
        modelUsuario.id != current_user.id,
        modelUsuario.cod_permissao_user != 2, 
        or_(modelUsuario.name.ilike('%'+pesquisa+'%'),
            modelUsuario.email.ilike('%'+pesquisa+'%')
        ),
        ).order_by(
            desc(modelUsuario.id)
        ).join(
        modelPermissaoUser,
        modelPermissaoUser.cod_permissao_user == modelUsuario.cod_permissao_user
    ).join(
        modelOrgao,
        modelOrgao.cod_orgao == modelUsuario.cod_orgao
    ).values(
        modelUsuario.id,
        modelUsuario.name,
        modelUsuario.email,
        modelUsuario.active,
        modelUsuario.cod_permissao_user,
        modelPermissaoUser.atributos_permissao_user,
        modelUsuario.cod_orgao,
        modelOrgao.descricao_orgao,
        modelUsuario.confirmed_at
    ) 
    
    
    return queryToJson(resultQuery)

@app.route("/api/admin/ativar_usuario/<int:id_usuario>", methods = ['PUT'])
@auth_token_required
@check_permission_admin
def ativar_usuario(id_usuario):
    
    data_ultima_movimentacao = datetime.now()
    
    dict_update = {"active": True,
                   "id_usuario_ativou": current_user.id,
                   "status_ultima_movimentacao": "ativar",
                   "data_ultima_movimentacao": data_ultima_movimentacao
                   }   
   
    modelUsuario.query.filter(modelUsuario.id == id_usuario).update(dict_update)
    db.session.commit()    
    
    return jsonify('Usuário Ativado com sucesso.'),200

@app.route("/api/admin/desativar_usuario/<int:id_usuario>", methods = ['DELETE'])
@auth_token_required
@check_permission_admin
def desativar_usuario(id_usuario):
    
    data_ultima_movimentacao = datetime.now()
    
    dict_update = {"active": False,
                   "id_usuario_desativou": current_user.id,
                   "status_ultima_movimentacao": "desativar",
                   "data_ultima_movimentacao": data_ultima_movimentacao
                   } 
   
    modelUsuario.query.filter(modelUsuario.id == id_usuario).update(dict_update)
    db.session.commit()    
    
    return jsonify('Usuário Desativado com sucesso.'),200