function getAccount(){
    const options={
        method:'POST',
        headers:{
            'Content-Type': 'text/json'
        }
    }
}
return fetch('http://185.102.139.56:8080/users/register')// регистрация пользователя
    .then