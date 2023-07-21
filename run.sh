#!/bin/bash

front_port=3000
back_port=8080

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

upgrade_pip(){
	python -m pip install --upgrade pip || python3 -m pip install --upgrade pip
	pip install --upgrade pip || pip3 install --upgrade pip
}

back_install_deps(){
	# pip install virtualenv || pip3 install virtualenv
	upgrade_pip
	pip install -r ./backend/requirements.txt || pip3 install -r backend/requirements.txt
	pip install -e ./backend/sparql/cucopy/. || pip3 install -e ./backend/sparql/cucopy/.
	pip install -e ./backend/sparql/techapi/. || pip3 install -e ./backend/sparql/techapi/.
	pip install -e ./backend/sparql/django-rdf-io/. || pip3 install -e ./backend/sparql/django-rdf-io/.
}

back_run_server(){
	# source ./backend/venv/bin/activate #Activate environment
	kill_port "$back_port"
	open "http://127.0.0.1:$back_port"
	python ./backend/manage.py runserver "$back_port" || python3 ./backend/manage.py runserver "$back_port"
}

front_install_deps(){
	if [ ! -d "node_modules" ]; then
		echo "Installing frontend dependencies..."
		cd ./frontend/
		npm install
		cd .. 
	fi
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
 	front_install_deps

	back_run_server &
	front_run_server &
	
	# Wait for SIGINT to trigger kill process
	sleep infinity
}

main

