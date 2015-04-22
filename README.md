oauth2orize_implicit_example
============================

This is an example of the oAuth implicit flow using oauth2orize, express 4 and mongoDB.

##### Installation

```
git clone https://github.com/reneweb/oauth2orize_implicit_example.git
npm install
node app.js
```
Note: You may need to change the database configuration in the db.js file, if mongoDB doesn't run using the default port or is not running on localhost.

##### Usage (with cURL)

###### 0 - Register a client

Navigate to /client/registration. Register a new client.

###### 1 - Register a user

Navigate to /registration. Register a new user.

###### 2 - Get an access token

Navigate to /login?clientId=&lt;clientId&gt;&redirectUri=&lt;redirectUri&gt;&responseType=token. Login with username and password. Then allow the client to access your account.
If everything works the access code is returned in the fragment identifier of the URL.


###### 3 - Access a restricted resource using the access token

```
curl -X GET <IP>:<PORT>/restricted -v -H "Authorization: Bearer <accessToken>"
```

