const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/BillHub', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Schema
const Schema = mongoose.Schema;
const BillingCompanySchema = new Schema({
  name: String,
  category: String,
});

//Model
const BillingCompany = mongoose.model('BillingCompany', BillingCompanySchema);

// API Endpoints
app.get('/billingcompanies', async (req, res) => {
    console.log("server.js running APP .get billingcompanies");
  try {
    const data = await BillingCompany.find();
    console.log("Fetched Data from MongoDB: ", data); // Log fetched data
    res.json(data);
  } catch (err) {
    console.log("Error:"+err);
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
