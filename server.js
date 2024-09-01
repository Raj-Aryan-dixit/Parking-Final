const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/parking', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDb connected.'))
    .catch(err => console.log(err));

const DataSchema = new mongoose.Schema({
    name: String,
    email: String
});

mongoose.set('debug', true);

const Data = mongoose.model('Data', DataSchema, 'parking');


app.post('/submit', async (req, res) => {
    console.log('Received Data', req.body);
    const { name, email } = req.body;

    try {
        const newData = new Data({ name, email });
        console.log("New Data", newData);
        await newData.save();
        res.status(200).json({ message: 'Data saved successfully', data: newData });
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred '});
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})