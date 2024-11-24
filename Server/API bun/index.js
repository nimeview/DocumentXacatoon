import { serve } from 'bun';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { readFile } from 'fs/promises';
// Путь для сохранения изображений
const uploadDir = join(process.cwd(), 'images');


const server = serve({
  port: 3000,
  fetch: async (req) => {
    if (req.method === 'POST') {
        
        const contentType = req.headers.get('Content-Type');
        if (!contentType || !contentType.includes('multipart/form-data')) {
            return new Response('Unsupported Media Type', { status: 415 });
        }
      

        const formData = await req.formData();
        const imgFile = formData.get('file');

        if (!imgFile) {
            return new Response('No file uploaded', { status: 400 });
        }

        const arrayBuffer = await imgFile.arrayBuffer();
        const filePath = join(uploadDir, imgFile.name);
        await writeFile(filePath, new Uint8Array(arrayBuffer));
        const url = new URL(req.url);
        const jsonData = url.searchParams.get('json');
  
        if (!jsonData) {
          return new Response('No JSON data provided', { status: 400 });
        }
  
        try {
            //переводим json в объектик
            const data = JSON.parse(jsonData);
            console.log('Received JSON:', data.key);
            //достаём инфу(в нашем случае инфа является путём до img)
            let imagePath = join(process.cwd(), 'images', data.key);
            // Читаем и отправляем img в ответе
            const imgBuffer = await readFile(imagePath);
        // CORS
        return new Response(imgBuffer, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'image/jpeg, image/png', 
            'Access-Control-Allow-Origin': '*',  
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
        } catch (error) {
          return new Response('Invalid JSON data', { status: 400 });
        }

    } 
    if (req.method === 'GET') {
        const url = new URL(req.url);
        const jsonData = url.searchParams.get('json');
  
        if (!jsonData) {
          return new Response('No JSON data provided', { status: 400 });
        }
  
        try {
          const data = JSON.parse(jsonData);
          console.log('Received JSON:', data);
  
          // Читаем и отправляем img в ответе, не понятно как получаем путь? чекни сэйм блок кода выше:-)
          let imagePath = join(process.cwd(), 'images', 'fanny.jpg');
          const imgBuffer = await readFile(imagePath);
          
          return new Response(imgBuffer, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'image/jpeg, image/png', // CORS
                'Access-Control-Allow-Origin': '*',  
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type'
              }
          });
        } catch (error) {
          return new Response('Invalid JSON data', { status: 400 });
        }
      } else {
      return new Response('Method Not Allowed', { status: 405 });
    }
  }
});

console.log('Server is running on http://localhost:3000');