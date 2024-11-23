mod upload;
mod connection_server;
mod users;
mod converter;
mod load_tile;

use crate::upload::process_image;

use actix_web::{web, App, HttpServer, Responder};
use futures_util::StreamExt;
use image::GenericImageView;
use serde::Serialize;
use std::io::Write;
use rayon::iter::{IntoParallelRefIterator, ParallelIterator};
use crate::load_tile::load_tile;
use crate::users::{register_user, login_user};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .route("/users/login", web::post().to(login_user))
            .route("/users/register", web::post().to(register_user))
            .route("/upload", web::post().to(process_image))
            .route("/load_tile", web::get().to(load_tile))
    })
        .bind("0.0.0.0:8080")?
        .run()
        .await
}