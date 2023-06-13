#!/bin/bash

backendUrl="http://localhost:8080"

######## NON POST METHODS #########

editUser(){
	curl -X PUT -H "Content-Type: application/json" -d '{"name":"Fulano senha fraca","password":"senhafraca321"}' $backendUrl/request/user/$1
}

deleteUser(){
	curl -X DELETE $backendUrl/request/user/$1
}

getUser(){
	curl -X GET $backendUrl/request/user/$1
}


######## POST METHODS #########

createUser(){
	curl -X POST -H "Content-Type: application/json" -d '{"name":"Fulano senha fraca","email":"fulano@email.com","password":"senhafraca321"}' $backendUrl/request/user/
}


main(){
	createUser()
}
