use actix_web::HttpResponse;
use image::{DynamicImage, ImageBuffer, ImageOutputFormat, ImageFormat, GenericImageView};
use std::io::Cursor;

pub fn binary_to_image(binary_data: Vec<u8>) -> Result<DynamicImage, Box<dyn std::error::Error>> {
    let cursor = Cursor::new(binary_data);

    let image = image::load(cursor, ImageFormat::Tiff)?;

    Ok(image)
}

pub fn binary_to_tiff(data: Vec<u8>, width: u32, height: u32) -> HttpResponse {
    let image = match ImageBuffer::from_raw(width, height, data) {
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