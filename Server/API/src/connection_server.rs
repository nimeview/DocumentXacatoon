use std::io::{Write, Read};
use std::net::TcpStream;
use serde_json::json;
use crate::upload::Tile;
use crate::users::UserData;

const ADDRESS: &str = "127.0.0.1:1234";

pub async fn send_json(user_data: UserData, _type: String) -> std::io::Result<()> {
    let mut stream = TcpStream::connect(ADDRESS)?;

    let serialized = serde_json::to_string(&json!(user_data))
        .expect("Could not serialize user data to json");

    let request = format!(
      "POST /data HTTP/1.1\r\n\
      Host: {ADDRESS}\r\n\
      Content-Type: application/json\r\n\
      Content-Length: {}\r\n\r\n\
      \r\n\
      {}" ,
        serialized.len(),
        serialized
    );

    stream.write_all(request.as_bytes())?;

    let mut response = String::new();
    stream.read_to_string(&mut response)?;

    println!("Response: {}", response);

    Ok(())
}

pub async fn send_tile(tile: Tile) -> std::io::Result<()> {
    let mut stream = TcpStream::connect(ADDRESS)?;

    let serialized = serde_json::to_string(&json!({"image": [tile]}))
        .expect("Failed to serialize tiles to JSON");

    let request = format!(
        "POST /data HTTP/1.1\r\n\
         Host: {ADDRESS}\r\n\
         Content-Type: application/json\r\n\
         Content-Length: {}\r\n\
         \r\n\
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