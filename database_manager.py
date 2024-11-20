from pymongo import MongoClient

'''
Для создания объекта нужно передать аргументы:
    ip и port базы данных,
    название базы данных

Класс создает две коллекции для хранения тайлов изображений
и данных юзеров
'''


class Database:
    def __init__(self, host: str, name_db: str) -> None:
        self._client = MongoClient(host)
        self._db = self._client[name_db]

    def insert_db_image(self, data) -> None:
        '''
        Метод сохраняет в коллекцию image тайлы
        Пример входного json:
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
        '''
        self._db["image"].insert_many([
            {
                "name": tile["name"],
                "binary": tile["binary"],
                "x": tile["x"],
                "y": tile["y"]
                } for tile in data
            ])

    def insert_db_user(self, data) -> None:
        '''
            Метод сохраняет в коллекцию image тайлы
            Пример входного json:
                [
                {
                    "name" : ...,
                    "password" : ...,
                    "roots" : [ ... ]
                },
                { ... },
                ...
                ]
        '''
        self._db["users"].insert_many([
            {
                "_id": user["name"],
                "password": user["password"],
                "roots": user["roots"]
                } for user in data
            ])
