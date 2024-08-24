from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
import requests
import gridfs
from bson.objectid import ObjectId
import jwt
import stripe
from datetime import datetime
from io import BytesIO
import base64

app = Flask(__name__)
CORS(app)
uri = "mongodb://jernej:FA5Ccw1lHpTTyDy@climb-shard-00-00.6ikge.mongodb.net:27017,climb-shard-00-01.6ikge.mongodb.net:27017,climb-shard-00-02.6ikge.mongodb.net:27017/?ssl=true&replicaSet=atlas-s7hxmc-shard-0&authSource=admin&retryWrites=true&w=majority&appName=cliMB"
client = MongoClient(uri)
db = client['cliMB']
fs = gridfs.GridFS(db)

stripe.api_key = 'sk_test_51PqU9fJQdsxzu2zOzhTobaEJrOwcSXhwXyepxANo2HZKf2Cv7Go3ZiXoLWOQEqeha5fWH5SOwUtCU14XXuI59OoD00EzHW6hmY'

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
    try:
        username = get_username_from_access_token(request)

        file = fs.find_one({"metadata.username": username})

        if file:
            return send_file(file, mimetype='image/jpeg', as_attachment=False)
        else:
            return jsonify({"error": "Image not found"}), 404

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401


@app.route('/create-payment-intent', methods=['POST'])
def create_payment_intent():
    try:
        data = request.get_json()
        amount = data.get('amount')

        username = get_username_from_access_token(request)

        users_collection = db['users']
        user = users_collection.find_one({"email": username})

        if not user:
            return jsonify({"error": "User not found"}), 404

        users_collection.update_one(
            {"email": username},
            {"$inc": {"celodnevna_karta": 1}}
        )


        payment_intent = stripe.PaymentIntent.create(
            amount=int(amount),  # Amount is in cents BTW
            currency='eur',
            payment_method_types=['card'],
            metadata={'integration_check': 'accept_a_payment'}
        )

        return jsonify({
            'client_secret': payment_intent['client_secret']
        }), 200

    except Exception as e:
        return jsonify(error=str(e)), 403


@app.route('/check-in', methods=['GET'])
def check_in():
    username = get_username_from_access_token(request)

    users_collection = db['users']
    user = users_collection.find_one({"email": username})

    if not user:
        return jsonify({"error": "User not found"}), 404

    st_kart = user.get('celodnevna_karta')
    if st_kart >= 1:
        users_collection.update_one(
            {"email": username},
            {"$inc": {"celodnevna_karta": -1}}
        )

        recent_users_collection = db['recent_users']
        recent_users_collection.insert_one({
            "username": username,
            "check_in_time": datetime.now()
        })

        return jsonify({"success": "Check-in uspešen. Ena celodnevna karta porabljena."}), 200
    else:
        return jsonify({"error": "Nimate dovolj celodnevnih kart."}), 400

@app.route('/recent-users', methods=['GET'])
def get_recent_users():

    recent_users_collection = db['recent_users']

    recent_users = list(recent_users_collection.find({}, {"_id": 0}))

    # Create a list to store users with their images
    users_with_images = []

    for user in recent_users:
        username = user.get('username')

        print("Username: ", username, flush=True)

        # Find the image for the user in GridFS
        file = fs.find_one({"metadata.username": username})

        if file:
            # Read the image from GridFS
            image_stream = file.read()
            image_data = BytesIO(image_stream)

            # Convert image data to a base64 string
            image_data_base64 = base64.b64encode(image_data.getvalue()).decode('utf-8')

            # Append user data with image
            users_with_images.append({
                "username": username,
                "check_in_time": user.get('check_in_time'),
                "userImageUrl": image_data_base64
            })
        else:
            # If no image is found, add user data without image
            users_with_images.append({
                "username": username,
                "check_in_time": user.get('check_in_time'),
                "userImageUrl": None
            })

    # Return the response
    return jsonify({"recent_users": users_with_images}), 200


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

def get_username_from_access_token(requestData):
        auth_header = requestData.headers.get('Authorization')
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
            return decoded_token.get('preferred_username')

        except jwt.ExpiredSignatureError:
            raise Exception("Token has expired")
        except jwt.InvalidTokenError:
            raise Exception("Invalid token")