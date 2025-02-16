import pymysql

def connect_to_mysql():
    try:
        # Establish the connection
        connection = pymysql.connect(
            host="127.0.0.1",
            user="root",
            password="1721",
            database="whey_protein",
            cursorclass=pymysql.cursors.DictCursor  # Ensures results are returned as dictionaries
        )
        print(" Successfully connected to MySQL!")
        return connection  # Return the connection for use elsewhere
    except pymysql.MySQLError as e:
        print(" Error while connecting to MySQL:", e)
        return None  # Return None to indicate a failure
