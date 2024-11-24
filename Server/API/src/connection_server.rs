use std::io::{Write, Read};
use std::net::TcpStream;
use actix_web::web::Json;
use serde_json::json;
use crate::upload::Tile;
use crate::users::UserData;

const ADDRESS: &str = "127.0.0.1:1234";

pub async fn send_json(user_data: Json<UserData>, _type: String) -> std::io::Result<()> {
    let mut stream = TcpStream::connect(ADDRESS)?;

    let serialized = serde_json::to_string(&json!({
        "type": _type,
        "user": {
            "login": user_data.login,
            "password": user_data.password,
        }
    }))?;

    let request = format!(
        "POST /data HTTP/1.1\r\n\
         Host: {ADDRESS}\r\n\
         Content-Type: application/json\r\n\
         Content-Length: {}\r\n\
         \r\n\r\n\
         {}",
        serialized.len(),
        serialized
    );

    stream.write_all(request.as_bytes())?;

    let mut response = String::new();
    stream.read_to_string(&mut response)?;

    println!("Response: {}", response);

    Ok(())
}

pub async fn get_tile(tile_name: String, x: String, y: String) -> std::io::Result<Vec<u8>> {
    let mut stream = TcpStream::connect(ADDRESS)?;

    let serialized = serde_json::to_string(&json!(
        {
            "_type": "get_tile",
            "tile_name": tile_name,
            "x": x,
            "y": y,
        }
    ))
        .expect("Failed to serialize tile");

    let request = format!(
        "GET /data? HTTP/1.1\r\n\
         Host: {ADDRESS}\r\n\
         Connection-Type: application/json\r\n\
         Content-Length: {}\r\n\
         \r\n\
         {}",
        serialized.len(),
        serialized
    );

    stream.write_all(request.as_bytes())?;

    let mut response = Vec::new();
    stream.read_to_end(&mut response)?;

    Ok(response)
}


pub async fn get_icon(name: String) -> std::io::Result<Vec<u8>> {
    let mut stream = TcpStream::connect(ADDRESS)?;

    let serialized = serde_json::to_string(&json!(
        {
            "_type": "get_icon",
            "name": name,
        }
    ))
        .expect("Failed to serialize tile");

    let request = format!(
        "GET /data? HTTP/1.1\r\n\
         Host: {ADDRESS}\r\n\
         Connection-Type: application/json\r\n\
         Content-Length: {}\r\n\
         \r\n\
         {}",
        serialized.len(),
        serialized
    );

    stream.write_all(request.as_bytes())?;

    let mut response = Vec::new();
    stream.read_to_end(&mut response)?;

    Ok(response)
}

pub async fn send_tile(tile: Tile) -> std::io::Result<()> {
    let mut stream = TcpStream::connect(ADDRESS)?;

    let serialized = serde_json::to_string(&json!(
        {
            "_type": tile._type,
            "name": tile.name,
            "binary": tile.binary,
            "x": tile.x,
            "y": tile.y,
        }
    ))
        .expect("Failed to serialize tiles to JSON");

    let request = format!(
        "POST /data HTTP/1.1\r\n\
         Host: {ADDRESS}\r\n\
         Content-Type: application/json\r\n\
         Content-Length: {}\r\n\
         \r\n\r\n\
         {}",
        serialized.len(),
        serialized
    );

    stream.write_all(request.as_bytes())?;

    let mut response = String::new();
    stream.read_to_string(&mut response)?;

    println!("Response: {}", response);

    Ok(())
}