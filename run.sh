#!/bin/bash

front_port=4040
back_port=3030

function back_install_deps(){
	pip install virtualenv || pip3 install virtualenv
}

function back_run_server(){
	# source ./backend/venv/bin/activate #Activate environment
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
