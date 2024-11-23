// uploadImage.js
export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('name', file.name);
    formData.append('file', file);

    try {
      const response = await fetch('http://185.102.139.56:8080/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Ошибка при загрузке изображения');
      }
  
      return await response.png(); // или просто вернуть response, если не нужно парсить
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };
  