from flask import Flask, Blueprint
from werkzeug.wrappers import Response
from flask_sqlalchemy import SQLAlchemy
import os
from flask_security import Security, SQLAlchemyUserDatastore, \
    UserMixin, RoleMixin, auth_token_required
from flask_cors import CORS

def create_app():
    app = Flask("gpro")
    CORS(app, supports_credentials=True)
    
    return app

app = create_app()
CORS(app, supports_credentials=True)

APP_CONFIG = "config.Development"
app.config.from_object(APP_CONFIG)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False
db = SQLAlchemy(app)

'''Declaração de Models'''
from server.database.model_estado import modelEstado
from server.database.model_municipio import modelMunicipio
from server.database.model_infracao import modelInfracao
from server.database.model_orgao import modelOrgao
from server.database.model_autuacao import modelAutuacao
from server.database.model_role import modelRole
from server.database.model_usuario import modelUsuario
from server.database.model_permissao_user import modelPermissaoUser
from server.database.model_usuario_config_ativacao import modelUsuarioConfigAtivacao

user_datastore = SQLAlchemyUserDatastore(db, modelUsuario, modelRole)
security = Security(app, user_datastore)

'''Declaração de APIs'''
from server.api.api_estado import estadoBlueprint
from server.api.api_municipio import municipioBlueprint
from server.api.api_infracao import infracaoBlueprint
from server.api.api_autuacao import autuacaoBlueprint
from server.api.api_usuario import usuarioBlueprint
from server.api.api_admin import adminBlueprint

'''Declaração de Blueprints'''
app.register_blueprint(estadoBlueprint)
app.register_blueprint(municipioBlueprint)
app.register_blueprint(infracaoBlueprint)
app.register_blueprint(autuacaoBlueprint)
app.register_blueprint(usuarioBlueprint)
app.register_blueprint(adminBlueprint)
