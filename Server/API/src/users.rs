use actix_web::{web, HttpResponse, Responder};
use serde::Deserialize;
use crate::connection_server::send_tcp;

#[derive(Deserialize)]
pub struct UserData {
    login: String,
    password: String,
}

pub async fn register_user(user_data: web::Json<UserData>) -> impl Responder {
    let login = user_data.login.clone();
    let password = user_data.password.clone();

    HttpResponse::Ok().body("User registered successfully!")
}

pub async fn login_user(user_data: web::Json<UserData>) -> impl Responder {
    let login = user_data.login.clone();
    let password = user_data.password.clone();

    HttpResponse::Ok().body("User logged in successfully!")
}