const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Secret key for JWT
const SECRET_KEY = "secretKey22499";

exports.login = function(req, res) {
    return new Promise(async function(resolve, reject) {
        try {
            
            // Get the collection from the global database object
            const userCollection = global.database.collection("admin");

            // Find the user by email
            const result = await userCollection.findOne({ email: req.body.email });

            if (!result) {
                return reject({ login: "fail", reason: "Entered email is not registered" });
            }


            // Compare the hashed password
            const match = await bcrypt.compare(req.body.pass, result.pass);
            if (match) {
                let payload = { id: result._id };
                let secretKey = "secretKey22499";
                let token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

                return resolve({ login: "success", token: token, name: result.name });
            } else {
                return reject({ login: "fail", reason: "Wrong Password, try again" });
            }
        } catch (error) {
            reject({ login: "fail", reason: error.message });
        }
    });
};

exports.jwtAuth = function(req, res) {
    return new Promise(async function(resolve, reject) {
        try {
            const token = req.get("access-token");
            if (!token) {
                return reject({ auth: "fail", reason: "No token provided" });
            }

            jwt.verify(token, "secretKey22499", async function(err, decoded) {
                if (err) {
                    return reject({ auth: "fail", reason: "Invalid token" });
                }

                // Get the collection and find the user
                const userCollection = global.database.collection("admin");
                const result = await userCollection.findOne({ _id: new ObjectId(decoded.id) });

                if (!result) {
                    return reject({ auth: "fail", reason: "User does not exist" });
                }

                if (result.name === req.body.name) {
                    return resolve({ auth: "success", user: result });
                } else {
                    return reject({ auth: "fail", reason: "Different user" });
                }
            });
        } catch (error) {
            reject({ auth: "fail", reason: error.message });
        }
    });
};