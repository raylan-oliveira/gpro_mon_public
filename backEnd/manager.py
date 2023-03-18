import os
from flask_script import Manager
from flask_migrate import MigrateCommand, Migrate
from server import app, db 

APP_CONFIG = "config.Production"
app.config.from_object(APP_CONFIG)

migrate = Migrate(app, db)
manager = Manager(app)
manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
	manager.run()