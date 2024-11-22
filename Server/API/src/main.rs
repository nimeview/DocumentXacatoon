mod upload;
mod connection_server;
mod users;

use crate::upload::process_image;
use crate::users::{login_user, register_user};

use actix_web::{web, App, HttpServer, Responder};
use futures_util::StreamExt;
use image::GenericImageView;
use serde::Serialize;
use std::io::Write;
use rayon::iter::{IntoParallelRefIterator, ParallelIterator};



#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .route("/upload", web::post().to(process_image))
            .route("/users/register", web::post().to(register_user))
            .route("/users/login", web::post().to(login_user))
    })
        .bind("127.0.0.1:8080")?
        .run()
        .await
}
//структура занятий и водный режим