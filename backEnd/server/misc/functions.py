from flask import jsonify, request
from flask_login import current_user

from server.database.model_permissao_user import modelPermissaoUser

import re
from functools import wraps
#Retorna JSON das API's
def queryToJson(data):
    list_to_json = []
    for row in data:
        list_to_json.append(dict(row._mapping))     
    return jsonify(list_to_json)

#Retorna data padrão brasileiro
def getAtualizarData(data):
    if(data != None):
        return str(data.strftime('%d/%m/%Y'))
    else:
        return data

#Recebe a data brasileira e converte para data americana **utilizado para inserir no DB.
def getConverterData(data):
    strdata = data.split('/')
    ano = strdata[2]
    mes = strdata[1]
    dia = strdata[0]
    newdate = ano+'-'+mes+'-'+dia
    return newdate

def dateToFronte(data):
    #2023-02-01 13:22:36
    strdata = str(data).split('-')
    ano = strdata[0]
    mes = strdata[1]
    dia = strdata[2]
    newdate = dia[:2]+'/'+mes+'/'+ano
    return str(newdate)
def check_permission_admin(view_func):
    def _decorator(*args, **kwargs):        
        # print(request)    
        msg= {'msg':'VIEW permission admin'}
        cod_permissao_user = current_user.cod_permissao_user
        user_id = current_user.id
        
        atributos_permissao_user = modelPermissaoUser.query.filter(
        modelPermissaoUser.cod_permissao_user == cod_permissao_user).values(
            modelPermissaoUser.atributos_permissao_user
        )
        permission_user_db = ''
        if atributos_permissao_user:
            for atributo in atributos_permissao_user:
                permission_user_db = atributo[0]
                break            
            if permission_user_db:
                if 'ADMIN' in permission_user_db:
                    return view_func(*args, **kwargs)                
                
                else:                    
                    return jsonify(msg), 450
                
            else:
                return jsonify(msg), 450
            
        else:
            return jsonify(msg), 450
        
    return wraps(view_func)(_decorator)

def check_permission_visualizar(view_func):
    def _decorator(*args, **kwargs):        
        # print(request)    
        msg= {'msg':'VIEW permission required'}
        cod_permissao_user = current_user.cod_permissao_user
        user_id = current_user.id
        
        atributos_permissao_user = modelPermissaoUser.query.filter(
        modelPermissaoUser.cod_permissao_user == cod_permissao_user).values(
            modelPermissaoUser.atributos_permissao_user
        )
        permission_user_db = ''
        if atributos_permissao_user:
            for atributo in atributos_permissao_user:
                permission_user_db = atributo[0]
                break
            
            if permission_user_db:                
                if 'VISUALIZAR' in permission_user_db:
                    
                    return view_func(*args, **kwargs)
                
                else:
                    return jsonify(msg), 450
                
            else:
                    return jsonify(msg), 450
        
        else:
            return jsonify(msg), 450
        
    return wraps(view_func)(_decorator)

def check_permission_deletar(view_func):
    def _decorator(*args, **kwargs):        
        # print(request)    
        msg= {'msg':'DELETE permission required'}
        cod_permissao_user = current_user.cod_permissao_user
        user_id = current_user.id
        
        atributos_permissao_user = modelPermissaoUser.query.filter(
        modelPermissaoUser.cod_permissao_user == cod_permissao_user).values(
            modelPermissaoUser.atributos_permissao_user
        )
        permission_user_db = ''
        if atributos_permissao_user:
            for atributo in atributos_permissao_user:
                permission_user_db = atributo[0]
                break
            
            if permission_user_db:
                if 'DELETAR' in permission_user_db:
                    return view_func(*args, **kwargs)
                
                else:
                    return jsonify(msg), 450
                
            else:
                    return jsonify(msg), 450
                
        else:
            return jsonify(msg), 450
        
    return wraps(view_func)(_decorator)

def check_permission_inserir(view_func):
    def _decorator(*args, **kwargs):        
        # print(request)    
        msg= {'msg':'INSERT permission required'}
        cod_permissao_user = current_user.cod_permissao_user
        user_id = current_user.id
        
        atributos_permissao_user = modelPermissaoUser.query.filter(
        modelPermissaoUser.cod_permissao_user == cod_permissao_user).values(
            modelPermissaoUser.atributos_permissao_user
        )
        permission_user_db = ''
        if atributos_permissao_user:
            for atributo in atributos_permissao_user:
                permission_user_db = atributo[0]
                break
            
            if permission_user_db:
                if 'INSERIR' in permission_user_db:
                    return view_func(*args, **kwargs)
                
                else:
                    return jsonify(msg), 450
            
            else:
                    return jsonify(msg), 450
            
        else:
            return jsonify(msg), 450
        
    return wraps(view_func)(_decorator)
