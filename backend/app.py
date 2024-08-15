from flask import Flask, jsonify
from flask_oidc import OpenIDConnect
from flask_cors import CORS
from pymongo.mongo_client import MongoClient

app = Flask(__name__)
CORS(app)
uri = "mongodb://jernej:FA5Ccw1lHpTTyDy@climb-shard-00-00.6ikge.mongodb.net:27017,climb-shard-00-01.6ikge.mongodb.net:27017,climb-shard-00-02.6ikge.mongodb.net:27017/?ssl=true&replicaSet=atlas-s7hxmc-shard-0&authSource=admin&retryWrites=true&w=majority&appName=cliMB"
# mongo_uri = os.getenv('MONGO_URI', 'mongodb+srv://jernej:FA5Ccw1lHpTTyDy@climb.6ikge.mongodb.net/?retryWrites=true&w=majority&appName=cliMB')
client = MongoClient(uri)
db = client['cliMB']

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

app.config.update({
    'SECRET_KEY': '994e5c87-1968-44c7-b28b-750c680c3700',
    'TESTING': True,
    'DEBUG': True,
    'OIDC_CLIENT_SECRETS': 'client_secrets.json',
    'OIDC_ID_TOKEN_COOKIE_SECURE': False,
    'OIDC_OPENID_REALM': 'http://keycloak:5000/oidc_callback'
})
oidc = OpenIDConnect(app)


@app.route("/")
def hello_world():
    if oidc.user_loggedin:
        return ('Hello, %s, <a href="/private">See private</a> '
                '<a href="/logout">Log out</a>') % \
            oidc.user_getfield('email')
    else:
        return 'Welcome anonymous, <a href="/private">Log in</a>'


@app.route('/register', methods=['POST'])
def register_user():
    try:
        # Extract user information from the Keycloak event
        user_info = request.json
        user_id = user_info['userId']
        username = user_info['username']
        email = user_info['email']

        # Create a user document for MongoDB
        user_doc = {
            '_id': user_id,  # Keycloak user ID
            'username': username,
            'email': email,
            'registered_at': datetime.datetime.utcnow()
        }

        # Insert the user into the database
        db.users.insert_one(user_doc)

        return jsonify({"status": "success"}), 201
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/example')
def example():
    # Fetch all documents from the 'test' collection
    data = list(db.test.find())  # Convert cursor to list

    # Optionally, remove the ObjectId from the documents (as it is not JSON serializable)
    for doc in data:
        doc['_id'] = str(doc['_id'])

    return jsonify(data)