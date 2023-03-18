from flask import Flask, jsonify, request, Blueprint
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc, asc, or_

from datetime import datetime
from flask_security import auth_token_required
from flask_cors import CORS

from server import app, db

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

from ast import literal_eval

from server.database.model_autuacao import modelAutuacao
from server.database.model_usuario import modelUsuario
from server.database.model_municipio import modelMunicipio
from server.database.model_infracao import modelInfracao

from server.misc.functions import queryToJson, getAtualizarData, getConverterData, check_permission_visualizar, check_permission_deletar, check_permission_inserir

autuacaoBlueprint = Blueprint('autuacaoBlueprint', __name__)

@app.route('/api/autuacao/pesquisa', methods=['POST'])
@auth_token_required
@check_permission_visualizar
def pesquisar_autuacao():    
    
    try:
        pesquisa = request.json.get('input')
    except:
        pesquisa = ''
    if pesquisa == None:
        pesquisa = ''
    
    print(pesquisa)
    # pesquisa sem parametro
    resultQuery = modelAutuacao.query.filter(
        or_(modelAutuacao.n_processo.ilike('%'+pesquisa+'%'),
            modelAutuacao.nome_autuado.ilike('%'+pesquisa+'%'),
            modelAutuacao.nome_imovel.ilike('%'+pesquisa+'%'),
            modelAutuacao.cpf.ilike('%'+pesquisa+'%')),
        modelAutuacao.visible == True).order_by(
            desc(modelAutuacao.cod_autuacao)
        ).join(
        modelMunicipio,
        modelMunicipio.cod_municipio == modelAutuacao.cod_municipio
    ).join(
        modelInfracao,
        modelInfracao.cod_infracao == modelAutuacao.cod_infracao
    ).values(
        modelAutuacao.cod_autuacao,
        modelAutuacao.n_processo,
        modelAutuacao.nome_autuado,
        modelAutuacao.nome_imovel,
        modelAutuacao.cpf,
        modelAutuacao.id_alerta,
        modelAutuacao.monitoramento_embargo,
        modelMunicipio.cod_municipio,
        modelMunicipio.descricao_municipio,
        modelAutuacao.n_auto_infracao,
        modelAutuacao.cod_infracao,
        modelAutuacao.serie_auto_infracao,
        modelAutuacao.localizacao_imovel,
        modelAutuacao.area_imovel,
        modelInfracao.descricao_infracao,
        modelAutuacao.fiscal,
        modelAutuacao.descricao_sancao_aplicada,
        modelAutuacao.termo_compromisso,
        modelAutuacao.zona,
        modelAutuacao.coordenada,
        modelAutuacao.data_embargo,
        modelAutuacao.data_criacao,
    ) 
    
    
    list_to_json = []
    for row in resultQuery:
        row_dict = dict(row._mapping)        
        row_dict['coordenada'] = literal_eval(row_dict['coordenada'])        
        list_to_json.append(row_dict)     
    
    return jsonify(list_to_json)

#Deletar Autuacao
@app.route("/api/autuacao/<int:cod_autuacao>", methods=['DELETE'])
@auth_token_required
@check_permission_deletar
def deletarAutuacao(cod_autuacao):
    autuacao = {
        "visible" : False
    }
    modelAutuacao.query.filter(
        modelAutuacao.cod_autuacao == cod_autuacao).update(autuacao)
    db.session.commit()
    return jsonify('Autuação excluída com Sucesso!'),200

#Inserir novo autuacao
@app.route("/api/autuacao", methods=['POST'])
@auth_token_required
@check_permission_inserir
def inserirAutuacao():
    
    print(request.json)
    try:
        fiscal_lista = request.json.get('fiscal')
        fiscal_string = ''
        for fiscal_dict in fiscal_lista:
            fiscal_string = fiscal_string + ', ' + fiscal_dict['fiscal']        
          
        fiscal = fiscal_string[1:].strip()
    except:
        fiscal = None
      
    nome_autuado = request.json.get('nome_autuado')
    nome_imovel = request.json.get('nome_imovel')
    cod_usuario = request.json.get('cod_usuario')
    monitoramento_embargo = request.json.get('monitoramento_embargo')
    n_processo = request.json.get('n_processo')
    
    id_alerta = request.json.get('id_alerta')
    cpf = request.json.get('cpf')
    n_auto_infracao = request.json.get('n_auto_infracao')
    serie_auto_infracao = request.json.get('serie_auto_infracao')
    localizacao_imovel = request.json.get('localizacao_imovel')
    descricao_sancao_aplicada = request.json.get('descricao_sancao_aplicada')
    sancao_aplicada = request.json.get('sancao_aplicada')
    termo_compromisso = request.json.get('termo_compromisso')
    zona = request.json.get('zona')
    
    try:
        area_imovel = float(request.json.get('area_imovel').replace(',', '.'))
    except:
        area_imovel = None   
        
    data_embargo = request.json.get('data_embargo')
    cod_municipio = request.json.get('cod_municipio')
    if cod_municipio == None or cod_municipio == '':
        cod_municipio = 1
    
    cod_infracao = request.json.get('cod_infracao')    
    if cod_infracao == None or cod_infracao == '':
        cod_infracao = 1
    data_criacao = datetime.now()
    visible = True
   
   
    coordenada = None
    try:
        coordenada = str(request.json.get('coordenada'))
        
    except:
        coordenada = None
   
    autuacao = {
        
        "n_processo": n_processo,
        "id_alerta": id_alerta,
        "nome_autuado": nome_autuado,
        "nome_imovel": nome_imovel,
        "cpf": cpf,
        "coordenada": coordenada,
        "n_auto_infracao": n_auto_infracao,
        "serie_auto_infracao": serie_auto_infracao,
        "localizacao_imovel": localizacao_imovel,
        "cod_municipio": cod_municipio,
        "data_criacao": data_criacao,
        "visible": visible,
        "cod_infracao": cod_infracao,
        "area_imovel": area_imovel,
        "descricao_sancao_aplicada": descricao_sancao_aplicada,
        "termo_compromisso": termo_compromisso,
        "zona": zona,
        "fiscal": fiscal,
        "data_embargo": data_embargo,
        "monitoramento_embargo": monitoramento_embargo,
        "cod_usuario":cod_usuario
        
    }
    addAutuacao = modelAutuacao(**autuacao)
    db.session.add(addAutuacao)
    db.session.commit()    
    msg = "Cadastro realizado com sucesso!"
    return jsonify(msg)    

#Atualização de autuacao.
@app.route("/api/autuacao/<int:cod_autuacao>", methods = ['PUT'])
@auth_token_required
@check_permission_inserir
def atualizarAutuacao(cod_autuacao):
    valores = request.json
    
    print('valores')
    print(valores)
    print()
    
    tem_fiscal = False
    try:
        fiscal_lista = request.json.get('fiscalArray')
        tem_fiscal = True
    except:
        valores['fiscal'] = None
    
    fiscal_string = ''    
    if tem_fiscal:
        
        for fiscal_dict in fiscal_lista:
            fiscal_string = fiscal_string + ', ' + fiscal_dict['fiscal']       
        
        valores['fiscal'] = fiscal_string[1:].strip()
    
    
    try:
        coordenada = request.json.get('coordenada')
        valores['coordenada'] = str(coordenada)
    except:
        valores['coordenada'] = None
        
    try:
        del valores['fiscalArray']
        del valores['data_criacao']
        del valores['descricao_municipio']
    except:
        pass
    
    
    if valores['cod_municipio'] == '':
        valores['cod_municipio'] = 1
    
    if valores['cod_infracao'] == '':
        valores['cod_infracao'] = 1
    
    if 'area_imovel' in valores:
        if valores['area_imovel'] != None:
            valores['area_imovel'] = float(str(valores['area_imovel']).replace(',', '.'))   
    
    cod_infracao = 1
    descricao_infracao = valores['descricao_infracao']
    if descricao_infracao:
        del valores['descricao_infracao']
        
        listainfracoes = modelInfracao.query.values(
            modelInfracao.cod_infracao,
            modelInfracao.descricao_infracao,
        )
        
        for infracao in listainfracoes:
            if infracao[1] == descricao_infracao:
                cod_infracao = infracao[0]
    try:
        del valores['descricao_infracao']
    except:
        pass
    valores['cod_infracao'] = cod_infracao
    
    
    print('valores commit')
    print(valores)
    print()
    
    modelAutuacao.query.filter(modelAutuacao.cod_autuacao == cod_autuacao).update(valores)
    db.session.commit()
    
    return jsonify('Autuacao Atualizado com sucesso.'),200
    
@app.route('/api/autuacao/relatorio/<data_inicial>/<data_final>/<ordenadopor>/<asc_or_desc>', methods=['GET'])
@auth_token_required
@check_permission_visualizar
def exibir_relatorio(data_inicial, data_final, ordenadopor, asc_or_desc):    
    
    if data_inicial == None or data_inicial == "":
        data_inicial = '01/01/1990'
        
    data_inicial = data_inicial.replace('-', '/')
    
    data_inicial = getConverterData(data_inicial)    
    
    if data_final == None or data_final == "":
        data_final = '31/12/2050'
    
    data_final = data_final.replace('-', '/')
    
    data_final = getConverterData(data_final)
    
    if ordenadopor == None or ordenadopor == "":
        ordenadopor = 'data'
        
    opcao_ordenacao = ''
    if ordenadopor == 'nome_imovel':
        opcao_ordenacao = modelAutuacao.nome_imovel
    elif ordenadopor == 'nome_autuado':
        opcao_ordenacao = modelAutuacao.nome_autuado
    elif ordenadopor == 'nome_municipio':
        opcao_ordenacao = modelMunicipio.descricao_municipio    
    else:
        opcao_ordenacao = modelAutuacao.data_criacao    
    
    relatorio = ''
    if asc_or_desc == 'desc':
        relatorio = 1
        resultQuery = modelAutuacao.query.filter(        
            modelAutuacao.data_criacao >= data_inicial,
            modelAutuacao.data_criacao <= data_final,
            modelAutuacao.visible == True).order_by(
            desc(opcao_ordenacao)).join(
        modelMunicipio,
        modelMunicipio.cod_municipio == modelAutuacao.cod_municipio
    ).join(
        modelInfracao,
        modelInfracao.cod_infracao == modelAutuacao.cod_infracao
    ).values(
        modelAutuacao.cod_autuacao,
        modelAutuacao.n_processo,
        modelAutuacao.nome_autuado,
        modelAutuacao.nome_imovel,
        modelAutuacao.cpf,
        modelAutuacao.id_alerta,
        modelAutuacao.monitoramento_embargo,
        modelMunicipio.cod_municipio,
        modelMunicipio.descricao_municipio,
        modelAutuacao.n_auto_infracao,
        modelAutuacao.serie_auto_infracao,
        modelAutuacao.localizacao_imovel,
        modelAutuacao.area_imovel,
        modelAutuacao.fiscal,
        modelInfracao.descricao_infracao,
        modelAutuacao.descricao_sancao_aplicada,
        modelAutuacao.termo_compromisso,
        modelAutuacao.zona,
        modelAutuacao.coordenada,
        modelAutuacao.data_embargo,
        modelAutuacao.data_criacao,
    )
        print(relatorio)
        
        list_to_json = []
        
        for row in resultQuery:
            row_dict = dict(row._mapping)
           
            list_row_coordenada = literal_eval(row_dict['coordenada'])            
            
            for coordenada in list_row_coordenada:
                new_row_dict = row_dict.copy()
                new_row_dict['cood_x'] = coordenada['cood_x']
                new_row_dict['cood_y'] = coordenada['cood_y']
                new_row_dict['descricao_coord'] = coordenada['descricao_coord']
                del new_row_dict['coordenada']
                list_to_json.append(new_row_dict)
                
            
            del row_dict['coordenada']
        
        return jsonify(list_to_json)
    
    if asc_or_desc == 'asc':
        relatorio = 2
        resultQuery = modelAutuacao.query.filter(        
            modelAutuacao.data_criacao >= data_inicial,
            modelAutuacao.data_criacao <= data_final,
            modelAutuacao.visible == True).order_by(
            asc(opcao_ordenacao)).join(
        modelMunicipio,
        modelMunicipio.cod_municipio == modelAutuacao.cod_municipio
    ).join(
        modelInfracao,
        modelInfracao.cod_infracao == modelAutuacao.cod_infracao
    ).values(
        modelAutuacao.cod_autuacao,
        modelAutuacao.n_processo,
        modelAutuacao.nome_autuado,
        modelAutuacao.nome_imovel,
        modelAutuacao.cpf,
        modelAutuacao.id_alerta,
        modelAutuacao.monitoramento_embargo,
        modelMunicipio.cod_municipio,
        modelMunicipio.descricao_municipio,
        modelAutuacao.n_auto_infracao,
        modelAutuacao.serie_auto_infracao,
        modelInfracao.descricao_infracao,
        modelAutuacao.localizacao_imovel,
        modelAutuacao.area_imovel,
        modelAutuacao.fiscal,
        modelAutuacao.descricao_sancao_aplicada,
        modelAutuacao.termo_compromisso,
        modelAutuacao.zona,
        modelAutuacao.coordenada,
        modelAutuacao.data_embargo,
        modelAutuacao.data_criacao,
    ) 
        print(relatorio)     
        return queryToJson(resultQuery)
