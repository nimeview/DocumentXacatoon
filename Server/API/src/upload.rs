use std::io::Cursor;
use actix_multipart::Multipart;
use actix_web::{HttpResponse, Responder};
use futures_util::StreamExt;
use image::{GenericImageView, io::Reader};
use serde::Serialize;

#[derive(Debug, Serialize, Clone)]
pub struct Tile {
    pub _type: String,
    pub name: String,
    pub binary: Vec<u8>,
    pub x: u32,
    pub y: u32,
}

async fn send_tile(tile: Tile) -> Result<(), Box<dyn std::error::Error>> {
    println!("sending tile");
    Ok(())
}

pub async fn process_image(mut payload: Multipart) -> impl Responder {
    let mut image_name = String::new();
    let mut image_data: Vec<u8> = Vec::new();

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
                    while let Some(Ok(chunk)) = field.next().await {
                        image_data.extend_from_slice(&chunk);
                    }
                }
                _ => {}
            }
        }
    }

    if let Err(e) = process_large_image(&image_data, 1024, 1024, image_name.clone()).await {
        return HttpResponse::InternalServerError()
            .body(format!("Failed to process image: {}", e));
    }
    println!("image processing successful!");
    HttpResponse::Ok().body("Tiles processed and sent successfully.")
}

async fn process_large_image(
    image_data: &[u8],
    tile_width: u32,
    tile_height: u32,
    image_name: String,
) -> Result<(), Box<dyn std::error::Error>> {
    println!("processing large image");
    let reader = Reader::new(Cursor::new(image_data))
        .with_guessed_format()?
        .decode()?;

    let (width, height) = reader.dimensions();

    let coordinates = (0..height)
        .step_by(tile_height as usize)
        .flat_map(move |y| {
            (0..width)
                .step_by(tile_width as usize)
                .map(move |x| (x, y))
        });

    for (x, y) in coordinates {
        let sub_image = reader.view(x, y, tile_width.min(width - x), tile_height.min(height - y));
        let tile = sub_image.to_image();

        let mut buffer = Cursor::new(Vec::new());
        tile.write_to(&mut buffer, image::ImageOutputFormat::Png)?;

        let tile = Tile {
            _type: "image".to_string(),
            name: image_name.clone(),
            binary: buffer.into_inner(),
            x,
            y,
        };

        if let Err(e) = send_tile(tile).await {
            return Err(e);
        }
    }

    Ok(())
}