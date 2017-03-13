# Physics is Beautiful

## Installation

Rquires MySql

* install mysql:
```
brew install mysql
```
* create a db named `pib_development` (either use mysql command line or sequel pro - like program: https://www.sequelpro.com, ex:

```
mysql -h 127.0.0.1
create database pib_development;
exit;
```

Requires Python 3.5, recommended to run in a virtual environment (virtualenv, consider using virtualenvwrapper to manage your virutal environments)

* install requirements:
```
pip install -r requirements.txt
```

* install npm:
```
brew install node
```

* get packages (from root directory):
```
npm install
```

## To run locally

* Build the front-end
```
./node_modules/.bin/webpack --config webpack.config.js
```
(if you want to reload automatically when changes are made, you can run):
```
./node_modules/.bin/webpack --config webpack.config.js --watch
```

* Setup the db:
```
./manage.py migrate
```

* Act

* Activate your virtual environment
* Run:
```
./manage.py runserver
```

* You should find the site running on `http://localhost:8000`

## Development

* We respect the rules set out by pep8 with the exception of a 100 character line limit.
* We use the flake8 python script for linting.
