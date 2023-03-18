from flask import Flask, jsonify, request, Blueprint
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc, text
from flask_login import current_user, login_user, logout_user

from datetime import date, datetime
from flask_security import auth_token_required
from flask_security.utils import encrypt_password, verify_password, get_hmac, verify_hash
from server import app, db
from server.misc.functions import queryToJson

from server.database.model_usuario import modelUsuario
from server.database.model_orgao import modelOrgao
from server.database.model_permissao_user import modelPermissaoUser
from server.database.model_usuario_config_ativacao import modelUsuarioConfigAtivacao

from server.api.marshmallow_Schema.schemas import UsuarioSchema, OrgaoSchema


usuario_schema = UsuarioSchema()
usuarios_schema = UsuarioSchema(many=True)

orgao_schema = OrgaoSchema()
orgaos_schema = OrgaoSchema(many=True)

def _list_orgao(cod_orgao):
    
    consulta = modelOrgao.query.filter(
        modelOrgao.visible == True,
        modelOrgao.cod_orgao == cod_orgao
        ).first()
     
    #dados = orgao_schema.dump(consulta)
    
    return consulta

def _list_all_orgaos():
    
    consulta = modelOrgao.query.filter(
        modelOrgao.visible == True
        ).order_by(
            modelOrgao.cod_orgao
                 ).values(
        modelOrgao.cod_orgao,
        modelOrgao.descricao_orgao,
        modelOrgao.sigla_orgao,
        modelOrgao.permissao_padrao_user
    )
     
    dados = orgaos_schema.dump(consulta)
    return dados

usuarioBlueprint = Blueprint('usuarioBlueprint', __name__)

@app.route("/api/orgao", methods=['GET'])
def orgaos():
     
    dados = _list_all_orgaos()
 
    return jsonify(dados)

@app.route("/api/usuario", methods=["POST"])
def inserir_usuario():
    
    nome_usuario=request.json.get('nome')
    cod_ativacao_user=request.json.get('cod_ativacao_user')    
    
    cod_permissao_user = 4
    active=False    
    cod_ativacao = None
    cod_orgao = 1
    cod_usuario_config_ativacao = None      
     
    try:
        cod_orgao = request.json.get('cod_orgao')        
    except:
        cod_orgao = 1
    
    if cod_orgao:
        
        dados_orgao = _list_orgao(int(cod_orgao))
        cod_permissao_user = dados_orgao.permissao_padrao_user   
     
      
    consulta_cod_ativacao = None    
    try:
        cod_ativacao = request.json.get('cod_ativacao')
        
        consulta_cod_ativacao = modelUsuarioConfigAtivacao.query.filter(
            modelUsuarioConfigAtivacao.visible == True,
            modelUsuarioConfigAtivacao.cod_ativacao == cod_ativacao
        ).first()        
        
    except:        
        cod_usuario_config_ativacao = None
    
    if consulta_cod_ativacao:
        
        cod_usuario_config_ativacao = consulta_cod_ativacao.cod_usuario_config_ativacao
        cod_permissao_user = consulta_cod_ativacao.permissao_padrao_user
        active = True     
    
    password=request.json.get('password')
    retry_password=request.json.get('retry_password')
    if password != retry_password:
        return jsonify('Senhas não conferem.'),205
    
    email=request.json.get('email')
    tema = 'theme-light'
    
    confirmed_at='now()'
    
    valida_email = modelUsuario.query.filter(modelUsuario.email==email).count()    
    
    if(valida_email > 0 ):        
        return jsonify('Email já cadastrado'),204
    else:
        usuario = {
            'name':nome_usuario,
            'email':email,
            'active':active,
            'password':encrypt_password(password),
            'tema':tema,
            'cod_permissao_user':cod_permissao_user,
            'cod_usuario_config_ativacao':cod_usuario_config_ativacao,
            'cod_orgao':cod_orgao,            
            'confirmed_at':confirmed_at
        }

        addUser = modelUsuario(**usuario)
        db.session.add(addUser)
        db.session.commit()
        msg = ''
        if active:
            msg ='Usuário Cadastrado e ATIVADO.'
        else:
            msg ='Para Ativar seu Cadastro contate a TI.'
        return msg

@app.route('/api/login', methods=['GET', 'POST'])
def login():
    
    email = request.json.get('email')
    password = request.json.get('password')

    user = modelUsuario.query.filter_by(email=email).first()   
    
    #print(get_hmac(user.password))
    # verify_password(password, user.password):
    if not user or not verify_password(password, user.password):
        return 'Senha ou email inválidos', 300 
    
    if user.password[:21] == "$pbkdf2-sha512$25000$":
        # print('password USER is CRYPTED')
        pass
        
    else:
        # print('password USER NOT CRYPTED')
        new_password_crypted = encrypt_password(password)
        password_crypted_dict = {'password': new_password_crypted}
    
        modelUsuario.query.filter(modelUsuario.email == email).update(password_crypted_dict)
        db.session.commit()
    
    login_user(user)
    token = current_user.get_auth_token()
    
    code = 200
    response = dict()
    permissao_user = None
    
    permissao_user_consulta = modelPermissaoUser.query.filter_by(cod_permissao_user=user.cod_permissao_user).first()
    
    if permissao_user_consulta:
        permissao_user = permissao_user_consulta.atributos_permissao_user
    #response['user']['authentication_token'] = token
    response['user'] = {'authentication_token': token,
                        'email': email,
                        'name': user.name,
                        'id':str(user.id),
                        'permissao_user': permissao_user
                    }
    

    return jsonify(dict(meta=dict(code=code), response=response)), code
    #{"meta":{"code":200},"response":{"user":{"authentication_token":"WyIxIiwiJDUkcm91bmRzPTUzNTAwMCQwWkdST3BPaXZIMy9hZnlqJG84OHQuTTQ5ZFlWSlVQMnVaVXBEUVpmemJwWnBYb2gxdkY5ZE9tYVB3LkIiXQ.FumNOg.SKpsr4zpD6EyM02qTnmGuITn-0w","id":"1"}}}

@app.route('/api/logout', methods=['GET', 'POST'])
@auth_token_required
def logout():

    """View function which handles a logout request."""
    
    if current_user.is_authenticated:
        logout_user()

    return 'sucesso', 200

# @app.route("/api/usuario", methods=["GET"])
# @auth_token_required
# def usuarios():
#     valores = []
#     listausuarios = modelUsuario.query.all().values(
#         modelUsuario.id,
#         modelUsuario.email,
#         modelUsuario.name
#     )
#     return queryToJson(listausuarios)

@app.route("/api/usuario/<int:id_user>", methods=["GET"])
@auth_token_required
def usuario(id_user):
    
    usuario = modelUsuario.query.filter(
        modelUsuario.id == id_user,
        modelUsuario.active == True).first()
    
    return usuario_schema.dump(usuario)



@app.route('/api/tema/<int:id>', methods=['PUT'])
@auth_token_required
def atualizar_tema(id):
    
    tema = request.json['tema']
    
    if tema != 'theme-light' and tema != 'theme-dark':
        return ('Error, tema inexistente.', 300)
    
    tema = {'tema': tema}
    
    modelUsuario.query.filter(modelUsuario.id == id).update(tema)
    db.session.commit()
    return ('Sucesso', 200)
    
@app.route('/api/usuario/<int:id>', methods=['PUT'])
@auth_token_required
def atualizar_usuario(id):
    senha_antiga=request.json.get('old_password')
    email=request.json.get('email')
    info_usuario = modelUsuario.query.filter(
        modelUsuario.email==email,
        modelUsuario.active==True).first()
    
    if verify_password(senha_antiga, info_usuario.password) == False:
        return jsonify('Senha antiga inválida'),204    
        
    valores = request.json
    
    if 'cod_permissao_user' in valores:
        del valores["cod_permissao_user"]
        
    del valores["authentication_token"]
    del valores["email"]
    del valores["id"]
    del valores["old_password"]
    del valores["permissao_user"]
    try:
        del valores["tema"]
    except:
        pass
    
    del valores["token"]
    
    
    
    password=valores['password']
    valores['password']=encrypt_password(password)
    modelUsuario.query.filter(modelUsuario.id == id).update(valores)
    db.session.commit()
    return ('Sucesso', 200)
