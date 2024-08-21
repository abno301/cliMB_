from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
import requests
import gridfs
from bson.objectid import ObjectId
import jwt

app = Flask(__name__)
CORS(app)
uri = "mongodb://jernej:FA5Ccw1lHpTTyDy@climb-shard-00-00.6ikge.mongodb.net:27017,climb-shard-00-01.6ikge.mongodb.net:27017,climb-shard-00-02.6ikge.mongodb.net:27017/?ssl=true&replicaSet=atlas-s7hxmc-shard-0&authSource=admin&retryWrites=true&w=majority&appName=cliMB"
client = MongoClient(uri)
db = client['cliMB']
fs = gridfs.GridFS(db)

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
    token = get_keycloak_admin_token()
    url = f"{KEYCLOAK_SERVER}/admin/realms/flask-demo/users"
    headers = {'Authorization': f'Bearer {token}'}

    response = requests.get(url, headers=headers)
    response.raise_for_status()
    users_keycloak = response.json()

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
def get_users():
    data = list(db.users.find())

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


@app.route('/urnik', methods=['GET'])
def get_urnik():
    urnik_doc = db['urnik']

    urnik = urnik_doc.find_one()

    if urnik is None:
        return jsonify({"message": "No urnik found"}), 404

    dogodki = urnik.get('dogodki', [])

    return jsonify(dogodki), 200

@app.route('/urnik', methods=['PUT'])
def update_urnik():
    try:
        dogodki = request.json

        urnik_doc = db['urnik']

        result = urnik_doc.replace_one({}, {"dogodki": dogodki}, upsert=True)


        return jsonify({"message": "Schedule updated successfully"}), 200

    except Exception as e:
        print(f"Error while updating schedule: {e}", flush=True)
        return jsonify({"error": "An error occurred while updating the schedule"}), 500


@app.route('/picture', methods=['POST'])
def upload_picture():
    file = request.files['image']
    username = request.form['username']

    existing_file = db['fs.files'].find_one({'metadata.username': username})

    if existing_file:
        fs.delete(existing_file['_id'])

    if 'image' not in request.files or 'username' not in request.form:
        return jsonify({"error": "Image file or username is missing"}), 400

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    file_id = fs.put(file, filename=file.filename, metadata={"username": username})

    return jsonify({"message": "Image successfully uploaded!", "file_id": str(file_id)}), 200


@app.route('/picture', methods=['GET'])
def get_picture_by_username():
    auth_header = request.headers.get('Authorization')
    if auth_header is None or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Authorization header is missing or invalid"}), 401

    token = auth_header.split(" ")[1]

    public_key = """
    -----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlCCO1wOBQuD4A1Ugg77akF2Htij6SqX88oDU5dLy6/1c9EiT9o/wmFQ7k51itskkZX4jQ+uQtfcKEUcFK9hO5owVObTKalh80lkb32Hsb35GdtNWeGuZbZ9Fcd3qp/eftUsVC3wpirlwA0XZXTqi9QDiHvGl25xbcTiAzv8DcEFJ6v14XaoXOTzGI+LK2FG1IH10ClWkDo7W3dtocwIzQ8Kni3siyyut0bix66oJnyNfEIO1cMgGRNuLNIElPNMIUO1HW/DCJH5yrHfWazQoPEqe6wx96DMAG9UfW535c4HpFuXORi3lYxWUC47CROt4fkyI0jGQVIp0+IKuwtiG3wIDAQAB
    -----END PUBLIC KEY-----
    """

    try:
        decoded_token = jwt.decode(token, public_key, algorithms=["RS256"], options={"verify_signature": False})
        username = decoded_token.get('preferred_username')

        file = fs.find_one({"metadata.username": username})

        if file:
            return send_file(file, mimetype='image/jpeg', as_attachment=False)
        else:
            return jsonify({"error": "Image not found"}), 404

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

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