use std::io::Cursor;
use std::sync::Arc;
use actix_multipart::Multipart;
use actix_web::{HttpResponse, Responder};
use futures_util::StreamExt;
use image::{GenericImageView, io::Reader};
use rayon::iter::{IntoParallelRefIterator, ParallelIterator};
use serde::Serialize;
use crate::connection_server::send_tcp;
#[derive(Debug, Serialize)]
pub struct Tile {
    name: String,
    binary: Vec<u8>,
    x: u32,
    y: u32,
}

pub async fn process_image(mut payload: Multipart) -> impl Responder {
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

                    match process_large_image(&image_data, 1024, 1024, image_name.clone()).await {
                        Ok(result_tiles) => tiles = result_tiles,
                        Err(e) => {
                            return HttpResponse::InternalServerError()
                                .body(format!("Failed to process image: {}", e));
                        }
                    }
                }
                _ => {}
            }
        }
    }

    HttpResponse::Ok().json(serde_json::json!(tiles))
    //send_tcp(&tiles)
}

async fn process_large_image(
    image_data: &[u8],
    tile_width: u32,
    tile_height: u32,
    image_name: String,
) -> Result<Vec<Tile>, Box<dyn std::error::Error>> {

    let reader = Reader::new(Cursor::new(image_data))
        .with_guessed_format()?
        .decode()?;

    let (width, height) = reader.dimensions();

    let coordinates = Arc::new(
        (0..height)
            .step_by(tile_height as usize)
            .flat_map(move |h| {
                (0..width)
                    .step_by(tile_width as usize)
                    .map(move |w| (w, h))
            })
            .collect::<Vec<_>>(),
    );

    let tiles: Vec<Tile> = coordinates
        .par_iter()
        .map(|&(x, y)| {
            let sub_image = reader.view(x, y, tile_width.min(width - x), tile_height.min(height - y));
            let tile = sub_image.to_image();

            let mut buffer = Cursor::new(Vec::new());
            tile.write_to(&mut buffer, image::ImageOutputFormat::Tiff).unwrap();

            Tile {
                name: image_name.clone(),//структура занятий и водный режим
                binary: buffer.into_inner(),
                x,
                y,
            }
        })
        .collect();

    Ok(tiles)
}