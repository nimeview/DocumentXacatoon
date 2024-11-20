mod test;
use crate::test::test;

use actix_multipart::Multipart;
use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use futures_util::StreamExt;
use image::{DynamicImage, GenericImageView};
use serde::Serialize;
use base64;
use std::io::Cursor;

#[derive(Debug, Serialize)]
struct Tile {
    name: String,
    binary: Vec<u16>,
    x: u32,
    y: u32,
}

async fn process_image(mut payload: Multipart) -> impl Responder {
    let mut tiles: Vec<Tile> = vec![];
    let mut image_name = String::new();

    while let Some(Ok(mut field)) = payload.next().await {
        let content_disposition = field.content_disposition();

        if let Some(field_name) = content_disposition.get_name() {
            match field_name {
                "name" => {
                    let mut name_data = Vec::new();
                    while let Some(Ok(chunk)) = field.next().await {
                        name_data.extend_from_slice(&chunk);
                    }
                    image_name = String::from_utf8(name_data).unwrap();
                }
                "file" => {
                    let mut image_data: Vec<u8> = Vec::new();
                    while let Some(Ok(chunk)) = field.next().await {
                        image_data.extend_from_slice(&chunk);
                    }

                    let image = image::load_from_memory(&image_data).unwrap();
                    tiles = split_image(image, 256, 256, image_name.to_string());
                }
                _ => {}
            }
        }
    }

    HttpResponse::Ok().json(serde_json::json!(tiles))
}

fn split_image(image: DynamicImage, tile_width: u32, tile_height: u32, image_name: String) -> Vec<Tile> {
    let (width, height) = image.dimensions();
    let mut tiles = Vec::new();

    for h in (0..height).step_by(tile_height as usize) {
        for w in (0..width).step_by(tile_width as usize) {
            let sub_image = image.view(w, h, tile_width.min(width - w), tile_height.min(height - h));
            let tile = sub_image.to_image();

            let mut buffer = Cursor::new(Vec::new());
            tile.write_to(&mut buffer, image::ImageOutputFormat::Png).unwrap();

            tiles.push(Tile {
                name: image_name.clone(),
                binary: buffer.into_inner(),
                x: w,
                y: h,
            });
        }
    }

    tiles
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    test();
    HttpServer::new(|| {
        App::new()
            .route("/upload", web::post().to(process_image))
    })
        .bind("127.0.0.1:8080")?
        .run()
        .await
}