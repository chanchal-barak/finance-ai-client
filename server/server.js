const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const { port, mongoUri } = require("./config");

const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expenses");
const savingRoutes = require("./routes/savings");
const noteRoutes = require("./routes/notes");
const aiRoutes = require("./routes/ai");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/savings", savingRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/ai", aiRoutes);

/* 🔥 SERVE FRONTEND */
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../client/dist/index.html")
    );
  });
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(port, () =>
      console.log(`Server running on ${port}`)
    );
  })
  .catch(console.error);
