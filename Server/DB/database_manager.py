from pymongo import MongoClient


class Database:
    '''
    Класс для работы с mongoDB.

    Атрибуты:
    host (str): URI подключение.
    name_db (str): имя базы данных.


    Методы:
    insert_db_image(): создание объектов в коллекцию images.
    insert_db_user(): создание объектов в коллекцию users.
    '''

    def __init__(self, host: str, name_db: str) -> None:
        self._client = MongoClient(host)
        self._db = self._client[name_db]

    def insert_db_image(self, data: list[dict]) -> None:
        '''
            Метод сохраняет в коллекцию images тайлы.

            Пример входного json(data):
            [
            {
                "name" : ...,
                "binary" : [ ... ],
                "x" : ...,
                "y" : ...
            },
            { ... },
            ...
            ]
            :param data Список словарей тайлов картинок.
        '''
        if not isinstance(data, list):
            raise ValueError(f"Ожидание list, получен {type(data)}")
        for tiles in data:
            if self._db["images"].find_one({"name": tiles["name"]}):
                raise KeyError("Такая картинка уже есть")
            self._db["images"].insert_one(
                    {
                        "name": tiles["name"],
                        "binary": tiles["binary"],
                        "x": tiles["x"],
                        "y": tiles["y"]
                    }
                )

    def insert_db_user(self, data: list[dict]) -> None:
        '''
            Метод сохраняет в коллекцию users информацию
            о пользователях.

            Пример входного json(data):
            [
            {
                "login" : ...,
                "password" : ...,
                "roots" : [ ... ]
            },
            { ... },
            ...
            ]
            :param data: Список словарей с данными нового пользователя.
        '''
        if not isinstance(data, list):
            raise ValueError(f"Ожидание list, получен {type(data)}")
        for user in data:
            if self._db["users"].find_one({"login": user["login"]}):
                raise KeyError("Такой пользователь есть")
            self._db["users"].insert_one(
                    {
                        "login": user["login"],
                        "password": user["password"],
                        "roots": user["roots"]
                    })
