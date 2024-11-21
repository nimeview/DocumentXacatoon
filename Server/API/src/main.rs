mod upload;
mod connection_server;

use crate::upload::process_image;

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
            .route("/user", web::post().to(process_image))
    })
        .bind("127.0.0.1:8080")?
        .run()
        .await
}