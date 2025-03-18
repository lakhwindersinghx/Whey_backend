from database import connect_to_mysql
def test_db_connection():
    try:
        conn = connect_to_mysql()
        with conn.cursor(pymysql.cursors.DictCursor) : # ✅ Correct way
            cursor.execute("SELECT COUNT(*) FROM ingredients;")
            count = cursor.fetchone()
            print(f"✅ Database connection successful. Total ingredients: {count[0]}")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
