INSERT INTO public.estado
(uf, visible)
VALUES('AC', true);


INSERT INTO public.municipio
(descricao_municipio, cod_estado, visible)VALUES
	 (NULL, 1, false),
	 ('Acrelândia',1,true),
	 ('Assis Brasil',1,true),
	 ('Brasileia',1,true),
	 ('Bujari',1,true),
	 ('Capixaba',1,true),
	 ('Cruzeiro do Sul',1,true),
	 ('Epitaciolândia',1,true),
	 ('Feijó',1,true),
	 ('Jordão',1,true),
	 ('Manoel Urbano',1,true),
	 ('Marechal Thaumaturgo',1,true),
	 ('Mâncio Lima',1,true),
	 ('Plácido de Castro',1,true),
	 ('Porto Acre',1,true),
	 ('Porto Walter',1,true),
	 ('Rio Branco',1,true),
	 ('Rodriguês Alves',1,true),
	 ('Santa Rosa do Purus',1,true),
	 ('Sena Madureira',1,true),
	 ('Senador Guiomard',1,true),
	 ('Tarauacá',1,true),
	 ('Xapuri',1,true);
     
     
INSERT INTO public.permissao_user (descricao_permissao_user, atributos_permissao_user, visible) VALUES
	 (NULL, NULL, false),
	 ('ADMIN', 'ADMIN,DELETAR,INSERIR,VISUALIZAR', true),
	 ('DELETAR', 'DELETAR,INSERIR,VISUALIZAR', true),
	 ('INSERIR', 'INSERIR,VISUALIZAR', true),
	 ('SOMENTE_INSERIR', 'INSERIR', true),
	 ('VISUALIZAR', 'VISUALIZAR', true);
     
     
INSERT INTO public.orgao
	 (descricao_orgao, sigla_orgao, permissao_padrao_user, visible) VALUES
	 (NULL, NULL, NULL, false),
	 ('Instituto de Meio Ambiente do Acre', 'IMAC', 4, true),
	 ('Instituto Brasileiro do Meio Ambiente e dos Recursos Naturais Renováveis', 'IBAMA', 4, true),
	 ('Secretaria de Estado do Meio Ambiente e das Políticas Indígenas', 'SEMAPI', 4, true),
	 ('Instituto Chico Mendes de Conservação da Biodiversidade', 'ICMBIO', 4, true),
	 ('Fundação Nacional dos Povos Indígenas', 'FUNAI', 4, true),
	 ('Batalhão de Policiamento Ambiental', 'BPA', 4, true);

     
     
     
INSERT INTO public.infracao (descricao_infracao, visible) VALUES
	 (NULL, false),
	 ('Advertência',true),
	 ('Multa Simples',true),
	 ('Multa Diária',true),
	 ('Inutilização de Produto',true),
	 ('Interdição Parcial do Estabelecimento ou Atividade',true),
	 ('Demolição',true),
	 ('Suspensão De Venda ou Fabricação de Produto(s)',true),
	 ('Embargo Da Atividade ou Obra',true),
	 ('Apreensão De Produto(s) ou Equipamentos(s)',true);
	 ('TCO, Forças de Segurança',true);
	 ('Outros',true);

     
INSERT INTO public.usuario
("name", email, active, "password", tema, cod_permissao_user)
VALUES('ADMIN', 'admin@admin.com', true, 'adminPASSWORD', 'theme-dark', 3);


INSERT INTO public.usuario_config_ativacao
(descricao_usuario_config_ativacao, cod_ativacao, id_usuario_ativacao_criador, permissao_padrao_user, visible)
VALUES('cod test', 'COD3', 1, 3, true);





