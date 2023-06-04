!/bin/bash

front_port=4040
back_port=3030

function back_install_deps(){
	pip install -r requirements.txt || pip3 install -r requirements.txt
}

function back_run_server(){
	open "http://127.0.0.1:$back_port"
	python ./backend/manage.py runserver "$back_port" || python3 ./backend/manage.py runserver "$back_port"
}

function front_install_deps(){
	npm install
}

function front_run_server(){
	npm start
}

function main(){
	front_install_deps
}

back_run_server
