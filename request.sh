#!/bin/bash

backendUrl="http://localhost:8080"

######## NON POST METHODS #########

# editUser(){
# 	curl -X PUT -H "Content-Type: application/json" -d '{"name":"Fulano senha fraca","password":"senhafraca321"}' $backendUrl/request/user/$1
# }

deleteUser(){
	curl -X DELETE $backendUrl/request/user/$1
}

getUser(){
	curl -X GET $backendUrl/request/user/$1
}


######## POST METHODS #########

createUser() {
  curl -X POST -H "Content-Type: application/json" -d '{"name":"'"$1"'","email":"'"$2"'","password":"'"$3"'"}' "$backendUrl/request/user/"
}

login(){
  curl -X POST -H "Content-Type: application/json" -d '{"email":"'"$1"'","password":"'"$2"'"}' "$backendUrl/request/login/"
}


main(){
	createUser "Fulano Senha Fraca" "fulano@email.com" "senhafraca321"
	login "fulano@email.com" "senhafraca321"
}

main
