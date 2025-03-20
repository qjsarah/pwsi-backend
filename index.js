const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const path = require('path');
const fs = require('fs');
const bcrypt = require("bcrypt");
const bodyParser = require('body-parser');

const app = express();
const PORT = 5038;

// Database Connection Setup
const CONNECTION_STRING = "mongodb+srv://pwdsi3969:6CErfup5JR6DSVih@cluster0.eajln.mongodb.net/";
const DATABASENAME = "PWSIDB";

MongoClient.connect(CONNECTION_STRING, (error, client) => {
  if (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process if DB fails to connect
  }
  global.database = client.db(DATABASENAME);  
  console.log("Yay! Connected to MongoDB cluster");
  createAdminUser()
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
let postRoutes = require("./routes/post-routes");
let login = require('./routes/login');
let volunteerRoutes = require('./routes/volunteer-routes');
let contactRoutes = require('./routes/contact-routes');
let subscriberRoutes = require('./routes/subscriber-routes');
postRoutes(app);
async function createAdminUser() { //precreated admin user
  try {
    const adminEmail = "admin@gmail.com";
    const adminPassword = "admin123";
    const adminCollection = global.database.collection("admin");

    const existingAdmin = await adminCollection.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin user already exists, skipping creation.");
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await adminCollection.insertOne({
      name: "Admin",
      email: adminEmail,
      pass: hashedPassword,
      role: "admin",
      createdAt: new Date().toISOString(),
    });

    console.log("Admin user created successfully!");
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}
login(app);
volunteerRoutes(app);
contactRoutes(app);
subscriberRoutes(app);
// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});