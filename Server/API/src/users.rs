use actix_web::{web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use crate::connection_server::send_json;

#[derive(Serialize, Deserialize, Debug)]
pub struct UserData {
    pub login: String,
    pub password: String,
}

pub async fn login_user(user_data: web::Json<UserData>) -> impl Responder {
    if let Err(e) = send_json(user_data, "login".to_string()).await {
        eprintln!("Error sending data to the server: {:?}", e);
        return HttpResponse::InternalServerError().body("Failed to login user");
    }

    HttpResponse::Ok().body("User login")
}
pub async fn register_user(user_data: web::Json<UserData>) -> impl Responder {
    if let Err(e) = send_json(user_data, "register".to_string()).await {
        eprintln!("Error sending data to the server: {:?}", e);
        return HttpResponse::InternalServerError().body("Failed to register user");
    }

    HttpResponse::Ok().body("User registered")
}