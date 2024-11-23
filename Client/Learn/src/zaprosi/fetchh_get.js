function getAccount(){
    const options={
        method:'GET',
        headers:{
            'Content-Type': 'text/json'
        }
    }
}
return fetch('http://185.102.139.56:8080/users/login')// вход пользователя
    .then