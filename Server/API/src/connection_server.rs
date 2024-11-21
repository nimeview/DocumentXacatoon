use std::io::Write;
use std::net::TcpStream;
use flate2::{Compression, write::GzEncoder};
use crate::upload::Tile;

pub async fn send_tcp(tiles: Tile) -> std::io::Result<()> {
    let address = "127.0.0.1:1234";
    let mut stream = TcpStream::connect(address)?;

    let serialized = serde_json::to_vec(&tiles).expect("Failed to serialize tiles to JSON");

    let mut encoder = GzEncoder::new(Vec::new(), Compression::default());
    encoder.write_all(&serialized)?;
    let compressed_data = encoder.finish()?;

    stream.write_all(&compressed_data)?;
    Ok(())
}