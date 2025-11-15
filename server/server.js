const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { port, mongoUri } = require('./config');
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const aiRoutes = require('./routes/ai');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/ai', aiRoutes);
app.use("/api/savings", require("./routes/savings"));
app.use("/api/notes", require("./routes/notes"));


mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> {
    console.log('MongoDB connected');
    app.listen(port, ()=> console.log(`Server running on ${port}`));
  })
  .catch(err => console.error(err));
