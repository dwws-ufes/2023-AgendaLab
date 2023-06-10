#!/bin/bash

front_port=3000
back_port=8000

kill_port(){
	# Find the process ID (PID) using lsof
	local PID=$(lsof -t -i :$1)

	# Check if the PID exists
	if [ -z "$PID" ]; then
	  echo "No process is running on port 8000."
	else
	  # Kill the process using kill command
	  kill $PID
	  echo "Process with PID $PID has been killed."
	fi
}

back_install_deps(){
	# pip install virtualenv || pip3 install virtualenv
	pip install -r ./backend/requirements.txt || pip3 install -r ./backend/requirements.txt
}

back_run_server(){
	# source ./backend/venv/bin/activate #Activate environment
	kill_port "$back_port"
	open "http://127.0.0.1:$back_port"
	python ./backend/manage.py runserver "$back_port" || python3 ./backend/manage.py runserver "$back_port"
}

front_install_deps(){
	npm install
}

front_run_server(){
	kill_port "$front_port"
	cd ./frontend
	npm start #Automatically open browser when started
	cd ..
}

kill_process(){
	kill_port "$front_port"
	kill_port "$back_port"
}

main(){
	# Set up a signal handler for SIGINT (Ctrl+C)
	trap 'kill_process' SIGINT

	back_install_deps
 	# front_install_deps

	back_run_server &
	front_run_server &
	
	# Wait for SIGINT to trigger kill process
	sleep infinity
}

main

