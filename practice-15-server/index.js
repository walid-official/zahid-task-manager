require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "https://clearify-official.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// JWT Verification Middleware
const verifyJWT = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).send({ message: "Unauthorized Access" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (error, decoded) => {
    if (error) {
      return res.status(401).send({ message: "Unauthorized Access" });
    }
    req.decodedToken = decoded;
    next();
  });
};

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pxdhv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0;`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("taskDB");
    const usersCollection = database.collection("usersCollection");
    const tasksCollection = database.collection("tasksCollection");

    // JWT Token Generate
    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
        expiresIn: "1h",
      });

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ login: true });
    });

    // JWT Token Remove
    app.post("/jwtRemove", (req, res) => {
      res
        .clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ logout: true });
    });

    // Home Route
    app.get("/", (req, res) => {
      res.send("Server Connected Successfully");
    });

    // Protected Route Example
    app.get("/privateInfo/:email", verifyJWT, (req, res) => {
      const email = req.params.email;
      if (req.decodedToken.email !== email) {
        return res.status(403).send({ message: "Forbidden Access" });
      }
      res.send("Sent Database Data based on parameter email");
    });

    // ------------------- USERS ROUTES -------------------

    // Create User
    app.post("/users", async (req, res) => {
      const user = req.body;
      const existingUser = await usersCollection.findOne({ email: user.email });

      if (existingUser) {
        return res.send({ message: "User Already Exists", insertedId: null });
      }

      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // ------------------- TASKS ROUTES -------------------

    // Create Task
    app.post("/tasks", async (req, res) => {
      const task = req.body;
      console.log(task);
      try {
        const result = await tasksCollection.insertOne(task);
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Failed to create task" });
      }
    });

    // Get Tasks by User Email
    app.get("/tasks/:email", async (req, res) => {
      const email = req.params.email;
      try {
        const result = await tasksCollection.find({ email }).toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Failed to fetch tasks" });
      }
    });

    // Update Task (Title or Category)
    app.patch("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const { title, category } = req.body;

      const updateFields = {};
      if (title) updateFields.title = title;
      if (category) updateFields.category = category;

      try {
        const result = await tasksCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateFields }
        );
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Failed to update task" });
      }
    });

    // Delete Task
    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const result = await tasksCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Failed to delete task" });
      }
    });

    // update task operation

    app.get("/singleTasks/:id", async (req, res) => {
      const taskId = req.params.id;
      const result = await tasksCollection.findOne({
        _id: new ObjectId(taskId),
      });
      res.send(result);
    });


    app.patch('/update-task/:id', async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;
  console.log(updateData);
      // Validate ObjectId
      if (!ObjectId.isValid(id)) {
          return res.status(400).send({ error: 'Invalid Task ID' });
      }
  
      try {
          const result = await tasksCollection.updateOne(
              { _id: new ObjectId(id) },
              { $set: { ...updateData } }
          );
  
          if (result.matchedCount === 0) {
              return res.status(404).send({ error: 'Task not found' });
          }
  
          res.send({ message: 'Task updated successfully' });
      } catch (err) {
          console.error('Error updating task:', err);
          res.status(500).send({ error: 'Internal Server Error' });
      }
  });
    


  } catch (err) {
    console.error(err);
  }

  
}
run().catch(console.log);

// Start Server
app.listen(port, () => {
  console.log(`Server Running on... : ${port}`);
});
