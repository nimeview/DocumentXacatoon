use actix_multipart::Multipart;
use actix_web::{HttpResponse, Responder};
use futures_util::StreamExt;
use image::GenericImageView;
use std::io::{Cursor};
use crate::connection_server::send_tcp;

// Структура для представления тайла
#[derive(Debug, serde::Serialize)]
pub struct Tile {
    pub name: String,
    pub binary: Vec<u8>,
    pub x: u32,
    pub y: u32,
}

// Главная асинхронная функция для обработки изображения
pub async fn process_image(mut payload: Multipart) -> impl Responder {
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

                    // Обработка изображения
                    if let Err(e) = process_large_image(&image_data, 1024, 1024, &image_name).await {
                        return HttpResponse::InternalServerError()
                            .body(format!("Failed to process image: {}", e));
                    }
                }
                _ => {}
            }
        }
    }

    HttpResponse::Ok().body("Image processed successfully")
}

// Асинхронная функция для обработки большого изображения
async fn process_large_image(
    image_data: &[u8],
    tile_width: u32,
    tile_height: u32,
    image_name: &str
) -> Result<(), Box<dyn std::error::Error>> {
    // Декодируем изображение из памяти
    let render = image::load_from_memory(image_data)?;

    // Получаем размеры изображения
    let (width, height) = render.dimensions();
    let mut buffer = Vec::new();

    // Преобразуем изображение в формат RGB
    let rgba_image = render.to_rgb8();
    buffer.extend_from_slice(&rgba_image);

    // Разбиваем изображение на тайлы по вертикали и горизонтали
    for y in (0..height).step_by(tile_height as usize) {
        for x in (0..width).step_by(tile_width as usize) {
            let mut tile_buffer = Vec::new();
            // Для каждой строки изображения, относящейся к текущему тайлу, копируем данные в буфер
            for row in y..(y + tile_height).min(height) {
                let start = (row * width + x) as usize * 3;
                let end = ((row * width + x + tile_width.min(width - x)) as usize) * 3;
                tile_buffer.extend_from_slice(&buffer[start..end]);
            }

            // Создаем изображение для текущего тайла
            let tile_image: image::ImageBuffer<image::Rgba<u8>, Vec<u8>> =
                image::ImageBuffer::from_raw(
                    tile_width.min(width - x),
                    tile_height.min(height - y),
                    tile_buffer,
                )
                    .ok_or("Failed to create tile")?;

            let mut output = Cursor::new(Vec::new());
            tile_image.write_to(&mut output, image::ImageOutputFormat::Png)?;

            send_tile(Tile {
                name: image_name.to_string(),
                binary: output.into_inner(),
                x,
                y,
            })
                .await?;
        }
    }

    Ok(())
}

// Асинхронная функция для отправки тайла через TCP
async fn send_tile(tile: Tile) -> Result<(), Box<dyn std::error::Error>> {
    send_tcp(tile).await?;
    Ok(())
}