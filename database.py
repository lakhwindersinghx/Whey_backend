# import pymysql

# def connect_to_mysql():
#     try:
#         # Establish the connection
#         connection = pymysql.connect(
#             host="127.0.0.1",
#             user="root",
#             password="1721",
#             database="whey_protein",
#             cursorclass=pymysql.cursors.DictCursor  # Ensures results are returned as dictionaries
#         )
#         print(" Successfully connected to MySQL!")
#         return connection  # Return the connection for use elsewhere
#     except pymysql.MySQLError as e:
#         print(" Error while connecting to MySQL:", e)
#         return None  # Return None to indicate a failure
import pymysql
import os

def connect_to_mysql():
    try:
        # Get credentials from environment variables
        DB_HOST = os.getenv("DB_HOST", "b8vtcotaqmvgtuxs8nep-mysql.services.clever-cloud.com")
        DB_USER = os.getenv("DB_USER", "uqwyjsbuhrlrac3z")
        DB_PASS = os.getenv("DB_PASS", "R09PlVnu1g53YaUYu1CH")
        DB_NAME = os.getenv("DB_NAME", "b8vtcotaqmvgtuxs8nep")

        connection = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASS,
            database=DB_NAME,
            cursorclass=pymysql.cursors.DictCursor
        )
        print("Successfully connected to Clever Cloud MySQL!")
        return connection
    except pymysql.MySQLError as e:
        print("Error while connecting to MySQL:", e)
        return None
