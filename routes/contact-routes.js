const { ObjectId } = require('mongodb');

module.exports = function(app) {
    //Get the contacts
app.get('/contacts/GetContacts', async (req, res) => {
    try {
      let result = await database.collection("contacts").find({}).toArray();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch the contacts."});
    }
  });
  
  //Add contacts
  app.post("/contacts/AddContact", async (req, res) => {
    try {
      let newContact = req.body;
      let result = await database.collection("contacts").insertOne(newContact);
      res.json({ message: "Contact added!", id: result.insertedId });
    } catch (error) {
      res.status(500).json({ error: "Failed to add contact"});
    }
  });
  
  //Delete contacts
  app.delete("/contacts/DeleteContacts", async (req, res) => {
    try {
      let id = req.query.id;
      if (!id) return res.status(400).json({ error: "ID is Required" });
      let result = await database.collection("contacts").deleteOne({_id: new ObjectId(id)});
  
      if (result.deletedCount === 0){
        return res.status(404).json({message: "Contact is not found"});
      }
      res.json({ message: "Deleted Successfully!" });
    } catch (error) {
      res.status(500).json({error: "Failed to delete contact"});
    }
  });
}