use actix_web::{web, HttpResponse, Responder};
use crate::connection_server::send_json;

pub(crate) struct UserData {
    login: String,
    password: String,
}

pub async fn register_user(req: web::Json<UserData>) -> impl Responder {
    send_json(req, "register".to_string()).await.expect("Error registering user");
    HttpResponse::Ok().body("Ok")
}

pub async fn login_user(req: web::Json<UserData>) -> impl Responder {
    send_json(req, "login".to_string()).await.expect("Error logging into user");
    HttpResponse::Ok().body("Ok")
}