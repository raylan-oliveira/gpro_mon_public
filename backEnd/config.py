import os
from os import getenv
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    PORT = 5000
    THREADED=True
    DEBUG = True
    CSRF_ENABLED = True
    WTF_CSRF_ENABLED = False
    #dialect://username:password@host:port/database
    #SQLALCHEMY_DATABASE_URI = 'postgresql://gpro_user:gpro_123@127.0.0.1:5432/db_gpro'
    SQLALCHEMY_DATABASE_URI = getenv('SQLALCHEMY_DATABASE_URI') 
    
    #SECRET_KEY = '55fdb928f1d00191301290aef2b49feb233'
    SECRET_KEY = getenv('SECRET_KEY') 
    # SECURITY_LOGIN_URL='/api/login'
    # SECURITY_LOGOUT_URL='/api/logout'
    SECURITY_PASSWORD_HASH='pbkdf2_sha512'
    #SECURITY_PASSWORD_SALT = '46fdb978f1d09152301190aeu2b99feb'
    SECURITY_PASSWORD_SALT = getenv('SECURITY_PASSWORD_SALT')
    JSONIFY_PRETTYPRINT_REGULAR=False
    SECURITY_TOKEN_AUTHENTICATION_HEADER='Authorization'
    

class Development(Config):
    DEVELOPMENT = True 
    DEBUG = True

class Production(Config):
    DEVELOPMENT=False
    DEBUG=False
    
