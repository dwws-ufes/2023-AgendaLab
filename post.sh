#!/bin/bash

createUser(){
	curl -X POST -H "Content-Type: application/json" -d '{"name":"Fulano senha fraca","email":"fulano@email.com","password":"senhafraca321"}' http://localhost:8080/request/user/
}

main(){
	createUser()
}
