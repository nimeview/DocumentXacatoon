// GetImage.js
export const getImage = async (tileName, x, y) => {
  const data = { tile_name: tileName, x, y };

  try {
    const response = await fetch('http://185.102.139.56:8080/image/load_tile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text(); 
      throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    return { url, name: `${tileName}_${x}_${y}.png` }; 

  } catch (error) {
    console.error('Ошибка:', error);
    return null;
  }
};


