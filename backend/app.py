from flask import Flask, jsonify
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
import requests

app = Flask(__name__)
CORS(app)
uri = "mongodb://jernej:FA5Ccw1lHpTTyDy@climb-shard-00-00.6ikge.mongodb.net:27017,climb-shard-00-01.6ikge.mongodb.net:27017,climb-shard-00-02.6ikge.mongodb.net:27017/?ssl=true&replicaSet=atlas-s7hxmc-shard-0&authSource=admin&retryWrites=true&w=majority&appName=cliMB"
client = MongoClient(uri)
db = client['cliMB']

KEYCLOAK_SERVER = "http://keycloak:8080/auth"
REALM_NAME = "master"
CLIENT_ID = "admin-cli"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin"

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)


@app.route('/check-users', methods=['GET'])
def register_user():
    print("in register user backend")
    token = get_keycloak_admin_token()
    url = f"{KEYCLOAK_SERVER}/admin/realms/flask-demo/users"
    headers = {'Authorization': f'Bearer {token}'}

    response = requests.get(url, headers=headers)
    response.raise_for_status()
    users_keycloak = response.json()
    print(users_keycloak)

    users_db = db['users']

    for user in users_keycloak:
        email = user.get('email')
        if email:
            if not users_db.find_one({"email": email}):
                users_db.insert_one({
                "email": email,
                "role": "uporabnik"
                })
                print(f"Inserted {email} into the database.")
            else:
                print(f"{email} already exists in the database.")


    users_to_return = list(db.users.find())
    for doc in users_to_return:
        doc['_id'] = str(doc['_id'])
    return jsonify(users_to_return), 200

@app.route('/get-users')
def example():
    data = list(db.users.find())

    # Optionally, remove the ObjectId from the documents (as it is not JSON serializable)
    for doc in data:
        doc['_id'] = str(doc['_id'])

    return jsonify(data)

@app.route('/get-user/<username>', methods=['GET'])
def get_user(username):
    users_db = db['users']
    user = users_db.find_one({"email": username}, {"_id": 0, "email": 1, "role": 1})

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user)


def get_keycloak_admin_token():
    url = f"{KEYCLOAK_SERVER}/realms/{REALM_NAME}/protocol/openid-connect/token"
    payload = {
        'grant_type': 'password',
        'username': ADMIN_USERNAME,
        'password': ADMIN_PASSWORD,
        'client_id': CLIENT_ID
    }
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}

    response = requests.post(url, data=payload, headers=headers)
    response.raise_for_status()
    return response.json()['access_token']