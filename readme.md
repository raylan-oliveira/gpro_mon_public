## Demo:
![Demon](https://raw.githubusercontent.com/raylan-oliveira/gpro_mon_public/main/gpro_mon.gif)

# Desenvolvimento
## BackEnd
#### Clona o repositório e instalar o python, pip (gerenciador de dependências do python) e o venv (gerenciador de ambiente virtual do python)

```sh
cd /var/www/
git clone git@github.com:raylan-oliveira/gpro_mon_public.git
sudo chmod -R 777 www/
cd **gpro_mon_public**/
sudo apt install python3 python3-pip python3-venv -y
```

#### Criar o ambiente virtual do python e ativá-lo
```sh
python3 -m venv venv # criar o ambiente virtual do python com a pasta venv
source /var/www/gpro_mon_public/venv/bin/activate # ativar o ambiente virtual do python
```

#### Instalar as dependências do python, com o ambiente virtual ativo
```sh
cd /var/www/gpro_mon_public/backEnd/
python3 -m pip install -r requirements.txt # instalando as dependências do python em requirements.txt
```
> Será instalado o **Flask**, utilizado para a API, e o **alembic**, utilizado para fazer as migrações do Banco de dados

### Resolver erro de importação do flask_script
````sh
sudo nano /home/user/.local/lib/python3.9/site-packages/flask_script/__init__.py
substituir linha
from flask._compat import text_type
por
from flask_script._compat import text_type
````
#### Instalar o postgres, utilizado para o Banco de Dados
```sh
sudo apt install postgresql -y
sudo service postgresql start
```
#### Criar o Banco de Dados
```sh
sudo -u postgres psql
CREATE DATABASE db_gpro;
CREATE USER gpro_user WITH PASSWORD 'gpro_123';
GRANT ALL PRIVILEGES ON DATABASE db_gpro to gpro_user;
\q
```
> As informações do banco de dados têm que ser as mesmas do arquivo *config.py* para que o **flask** consiga se comunicar com o banco de dados

#### Criar as tabelas do Banco de Dados utilizando o alembic
```sh
python3 manager.py db stamp head # cria tabela alembic_version
python3 manager.py db migrate # cria a última migração, com todas as tabelas. vai criar um arquivo .py, que será utilizado para fazer o upgrade
python3 manager.py db upgrade 594 # criar última versão do banco de dados, utilizando o nome do arquivo .py ou somente as iniciais do nome do arquivo .py. 
```
> O arquivo *manager.py * contém as configuções de inicialização do *flask* e de migrações
> **594** é a inicial do nome do arquivo .py gerado no comando *python3 manager.py db migrate*

#### Executar flask
```sh
python3 manager.py runserver -h 0.0.0.0 # executar o flask (API) na porta 5000, com as configurações do arquivo config.py
```
> É necessário fazer os insert nas tabelas do banco de dados.

## FrontEnd
#### Instalar o node, npm (gerenciador de dependências do node)
```sh
cd /var/www/gpro_mon_public/frontEnd/
sudo apt install nodejs npm -y
```

#### Instalar as dependências do node
```sh

npm install # instalar os pacotes do node em package.json
````
> Será instalado o **AngularJS**, utilizado para o FrontEnd


#### Executar node
```sh
npm start # executar o node na porta 2222, com as configurações do arquivo server.js
```

#### Acessar o **GPRO** no browser: http://localhost:2222/

> Já é possível criar algum usuário

# Produção
### Instalar nginx
```sh
sudo apt install nginx -y
```
#### Copiar as configurações necessárias do nginx
```sh
sudo cp /var/www/gpro_mon_public/extras/etc/nginx/nginx.conf /etc/nginx/
```
> Será substituido o arquivo padrão de configuração do nginx

#### Copiar as configurações necessárias do nginx para o node e o flask
```sh
sudo cp /var/www/gpro_mon_public/extras/etc/nginx/conf.d/node_flask.conf /etc/nginx/conf.d/
```
> No arquivo *node_flask.conf*, é necessário tracar o ip do server. Na pasta */etc/nginx/conf.d/*, use o comando: *sed -i 's/10.80.11.110/127.0.0.1/' node_flask.conf* para fazer a troca do ip para que o nginx seja executado localmente

#### Copiar os arquivos necessário para que o nginx utilize o SSL para comunicações HTTPS
```sh
sudo cp -fR extras/etc/nginx/ssl/ /etc/nginx/
```
> Será copiado **private-key.pem** (chave privada), **self-cert.pem** (certificado) e o arquivo **pass**, que é a senha do arquivo *private-key.pem*. Para criar outras configurações para o SSL, acesse o [link](https://docs.nginx.com/nginx/deployment-guides/load-balance-third-party/node-js/#configuring-an-ssltls-certificate-for-client-traffic)

#### Criar o usuario 'www', utilizado no arquivo 'nginx.conf'
```sh
sudo adduser --system --no-create-home --shell /bin/false --group --disabled-login www
```
#### Iniciar o nginx
```sh
sudo nginx
```
> Agora o **GPRO** pode ser acessado com HTTPS: https://127.0.0.1/#!/

#### Instalar o PM2 para executar o node com vários processos.
```sh
npm install pm2@latest -g
```
> Necesário **parar** a execução do node. Pode ser feito com o comando: *sudo pkill node*

#### Executando o node com o PM2
```sh
cd /var/www/gpro_mon_public/frontEnd/
pm2 start server.js -i max # executa o node com o vários processo
```

#### Utilizando o gunicorn para executar o python com vários processos.
```sh
sudo pkill python3 # parar a execução do python para não haver conflito com o gunicorn
source /var/www/gpro_mon_public/venv/bin/activate # ativar o ambiente virtual do python
gunicorn -w 4 -b 0.0.0.0:5000 manager:app --chdir /var/www/gpro_mon_public/backEnd/ --daemon
```
> **gunicorn** será executado com 4 processos em daemon

#### Instalar o supservisor para executar o PM2 e o gunicorn automaticamente ao iniciar o servidor
```sh
python3 -m pip install supervisor
```
> **supervisor** deve ser instalado quando ambiente do python esteja desativado. Para desativar o ambiente do python use o comando: *deactivate*

#### Configurações necessárias para o supervisor
```
cd /var/www/gpro_mon_public/extras/etc
sudo cp supervisord.conf /etc/
sudo mkdir /var/log/supervisor/ # criar a pasta de log do supervisor
```
> No arquivo *supervisord.conf* contém a configuração de execução do PM2 e do gunicorn

#### Copiando o daemon do supervisor
```sh
sudo cp /var/www/gpro_mon_public/extras/etc/init.d/supervisord /etc/init.d/
```
> O arquivo **supervisord**, contém as configurações para que o *supervisor* execute automaticamente quando o servidor foi iniciado, e o local dos binários *supervisord* e *supervisorctl*. Por padrão, os binários ficam em */usr/local/bin/*. Obtenha o path dos binários com o comando:  *which supervisord* e *which supervisorctl*

#### Configurando o daemon do supervisor
```sh
cd /etc/init.d/
sudo chmod +x supervisord
sudo update-rc.d supervisord defaults
```
> Agora o *supervisord* será executado assim que o servidor for ligado, e é um serviço, recebendo os comandos: *sudo service supervisord start* ou *stop*. Reinicie o servidor, e os combandos de serviços estarão disponíveis. O *supervisord* executará PM2 e o gunicorn automaticamente. Caso o PM2 ou o gunicorn feche por algum problema, o *supervisord* iniciará o PM2 ou o gunicorn automaticamente
