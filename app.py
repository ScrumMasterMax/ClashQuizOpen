from flask import Flask, jsonify
import mariadb

app = Flask(__name__)

def get_connection():
    return mariadb.connect(
        host="clashquiz.schrz.de:3307",
        user="DEIN_USER",
        password="",
        database="DEINE_DB"
    )

@app.route("/users")
def users():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT name FROM users")

    result = []

    for row in cursor:
        result.append(row[0])

    conn.close()

    return jsonify(result)

app.run(host="0.0.0.0", port=5000)
