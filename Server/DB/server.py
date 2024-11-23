import socket
import json
from database_manager import Database


sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.bind(("localhost", 1234))
sock.listen()

print("Сервер запущен и слушает порт 1234...")

while True:
    try:
        print("Ожидание подключения...")
        conn, address = sock.accept()
        print(f"Подключено: {address}")
        request_data = conn.recv(1024).decode()
        headers, body = request_data.split("\r\n\r\n", 1)

        try:
            json_data = json.loads(body)  # Преобразуем строку в JSON
            
            if isinstance(json_data, list):
                json_data = json_data[0]

            print(json.dumps(json_data, indent=4))

        except json.JSONDecodeError as e:
            print(f"Ошибка при разборе JSON: {e}")
        
        # Ответ клиенту (формируем JSON ответ)
        response_data = {
            "status": "ok",
            "message": "Data received successfully",
            "received_data": json_data
        }
        
        response_body = json.dumps(response_data)

        # Отправляем только JSON-данные, без заголовков HTTP
        conn.sendall(response_body.encode())

        # Закрываем соединение
        conn.close()

    except Exception as e:
        print(f"Ошибка при обработке запроса: {e}")
        if conn:
            conn.close()

sock.close()