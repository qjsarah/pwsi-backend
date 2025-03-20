const { ObjectId } = require("mongodb");

module.exports = function (app) {
    
//Get all volunteers
app.get('/volunteers/GetVolunteers', async (req, res) => {
    try {
        let result = await database.collection("volunteers").find({}).toArray();
        res.json(result);
    } catch (error) {
        console.error("Error fetching volunteers:", error);
        res.status(500).json({ error: "Failed to fetch volunteers" });
    }
});


//Add a volunteer
app.post("/volunteers/AddVolunteer", (req, res) => {
  let newVolunteer = req.body;
  database.collection("volunteers").insertOne(newVolunteer, (error, result) => {
    if (error) {
      res.status(500).json({ message: "Failed to add volunteer" });
    } else {
      res.json({ message: "Volunteer added!", id: result.insertedId });
    }
  });
});

//Delete a volunteer
app.delete("/volunteers/DeleteVolunteers", (req, res) => {
  let id = req.query.id;
  if (!id) return res.status(400).json({ error: "ID is required" });

  database.collection("volunteers").deleteOne({ _id: new ObjectId(id) }, (error, result) => {
    if (error) {
      res.status(500).json({ message: "Failed to delete volunteer" });
    } else if (result.deletedCount === 0) {
      res.status(404).json({ message: "Volunteer not found" });
    } else {
      res.json({ message: "Deleted successfully!" });
    }
  });
});
}