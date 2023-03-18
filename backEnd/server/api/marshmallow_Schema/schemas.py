#https://flask-marshmallow.readthedocs.io/en/latest/
#https://marshmallow-sqlalchemy.readthedocs.io/en/latest/
from server import create_app

from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
from marshmallow import Schema, fields

from server.database.model_municipio import modelMunicipio
from server.database.model_infracao import modelInfracao
from server.database.model_usuario import modelUsuario
from server.database.model_orgao import modelOrgao
from server.database.model_autuacao import modelAutuacao
from server.database.model_permissao_user import modelPermissaoUser

class PermissaoUserSchema(SQLAlchemySchema):
    class Meta:
        model = modelPermissaoUser#load_instance = True  # Optional: deserialize to model instances
    
    cod_permissao_user = auto_field()
    descricao_permissao_user = auto_field()
    atributos_permissao_user = auto_field()
class UsuarioSchema(SQLAlchemySchema):
    class Meta:
        model = modelUsuario
        #load_instance = True  # Optional: deserialize to model instances
    
    id = auto_field()
    email = auto_field()
    name = auto_field()
    cod_permissao_user = auto_field()

class OrgaoSchema(SQLAlchemySchema):
    class Meta:
        model = modelOrgao
        #load_instance = True  # Optional: deserialize to model instances
    
    cod_orgao = auto_field()
    descricao_orgao = auto_field()
    sigla_orgao = auto_field()
    permissao_padrao_user = auto_field()

class MunicipioSchema(SQLAlchemySchema):
    class Meta:
        model = modelMunicipio
        #load_instance = True  # Optional: deserialize to model instances
    
    cod_municipio = fields.Int()
    descricao_municipio = fields.Str()

class InfracaoSchema(SQLAlchemySchema):
    class Meta:
        model = modelInfracao
        #load_instance = True  # Optional: deserialize to model instances
    
    cod_infracao = fields.Int()
    descricao_infracao = fields.Str()
    
    