const { ObjectId } = require('mongodb');
module.exports = function(app) {
  //Get User Email
  app.get('/subscriber-email/GetEmail', async (req, res) => {
    try {
      let result = await database.collection("subscriber-email").find({}).toArray();
      console.log("Fetched Subscriber's Email: ", result);
      res.json(result);
    } catch (error) {
      console.error("Error fetching subscriber's email: ", error);
      res.status(500).json({error: "Failed to fetch subscriber's email."});
    }
  });

  //Add User Email
  app.post("/subscriber-email/AddEmail", (req, res) => {
    let newEmail = req.body;
    database.collection("subscriber-email").insertOne(newEmail, (error, result) => {
      if (error) {
        res.status(500).json({message: "Failed to add subscriber's email" });
      } else {
        res.json({ message: "Subscriber's Email added!", id: result.insertedId });
      }
    });
  });

  //Delete a UserEmail
  app.delete("/subscriber-email/DeleteEmail", (req, res) => {
    let id = req.query.id;
    if (!id) return res.status(400).json({ error: "ID is required" });
    database.collection("subscriber-email").deleteOne({_id: new ObjectId(id)}, (error, result) => {
    if (error) {
      res.status(500).json({ message: "Failed to delete subscriber's email "});
    } else if(result.deletedCount === 0) {
      res.statusCode(404).json({ message: "Subscriber's email not found"});
    } else {
      res.json({ message: "Deleted Successfully!"});
    }
    });
})};