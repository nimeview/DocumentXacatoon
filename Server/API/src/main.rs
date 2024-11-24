mod upload;
mod connection_server;
mod users;
mod converter;
mod images;

use crate::upload::process_image;

use actix_cors::Cors;
use actix_web::{web, App, HttpServer, Responder};
use futures_util::StreamExt;
use image::GenericImageView;
use serde::Serialize;
use std::io::Write;
use rayon::iter::{IntoParallelRefIterator, ParallelIterator};
use crate::images::upload_tile;
use crate::users::{register_user, login_user};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header();

        App::new()
            .wrap(cors)
            .route("/users/login", web::post().to(login_user))
            .route("/users/register", web::post().to(register_user))
            .route("/upload", web::post().to(process_image))
            .route("/image/load_tile", web::post().to(upload_tile))
    })
        .bind("0.0.0.0:8080")?
        .run()
        .await
}