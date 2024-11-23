use actix_web::{web, HttpResponse};
use image::{DynamicImage, ImageBuffer, ImageOutputFormat};
use crate::connection_server::get_tile;
use std::io::Cursor;

#[derive(serde::Deserialize)]
pub struct LoadTile {
    pub tile_name: String,
    pub x: u32,
    pub y: u32,
}

pub async fn load_tile(data: web::Json<LoadTile>) -> HttpResponse {
    let response = match get_tile(data.tile_name.to_string(), data.x.to_string(), data.y.to_string()).await {
        Ok(binary_data) => binary_data,
        Err(_) => return HttpResponse::InternalServerError().body("Failed to get tile data"),
    };

    let image = match ImageBuffer::from_raw(1024, 1024, response) {
        Some(buffer) => DynamicImage::ImageRgb8(buffer),
        None => {
            return HttpResponse::InternalServerError().body("Failed to create image from binary data");
        }
    };

    let mut tiff_data = Vec::new();
    if image.write_to(&mut Cursor::new(&mut tiff_data), ImageOutputFormat::Tiff).is_err() {
        return HttpResponse::InternalServerError().body("Failed to convert image to TIFF");
    }

    HttpResponse::Ok()
        .content_type("image/tiff")
        .body(tiff_data)
}