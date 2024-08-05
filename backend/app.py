from flask import Flask
from flask_oidc import OpenIDConnect
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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

