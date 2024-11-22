use std::io::Write;
use std::net::TcpStream;
use flate2::{Compression, write::GzEncoder};
use crate::upload::Tile;

const ADDRESS: &str = "127.0.0.1:1234";

pub async fn send_tile_tcp(tiles: Tile) -> std::io::Result<()> {
    let mut stream = TcpStream::connect(ADDRESS)?;

    let serialized = serde_json::to_vec(&tiles).expect("Failed to serialize tiles to JSON");

    stream.write_all(&serialized).await?;

    Ok(())
}

pub async fn send_json_tcp(tiles: Tile) -> std::io::Result<()> {

}