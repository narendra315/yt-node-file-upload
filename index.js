const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const uniqid = require('uniqid');
const app = express();

app.use('*', cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("API is up and running.")
})

let userList = [];

app.get('/user/list', (req, res) => {
    const { page, limit } = req.query;
    console.log(page, limit);
    res.send({ result: userList, error: null });
})

app.post('/user', (req, res) => {
    try {
        const model = req.body;

        model.id = uniqid();
        userList.push(model);
        res.send({ result: model, error: null })
    } catch (err) {
        res.send({ result: null, error: err.message })
    }
})

app.put('/user/:id', (req, res) => {
    try {
        const id = req.params.id;
        const filteredList = userList.filter(i => i.id !== id);
        const model = req.body;
        model.id = id;
        filteredList.push(model);
        userList = filteredList;

        res.send({ result: model, error: null })

    } catch (err) {
        res.send({ result: null, error: err.message })
    }
})

app.delete('/user/:id', (req, res) => {
    try {
        const id = req.params.id;
        const filteredList = userList.filter(i => i.id !== id);
        userList = filteredList;

        res.send({ result: "success", error: null })

    } catch (err) {
        res.send({ result: null, error: err.message })
    }
})

app.listen(8080, () => {
    console.log('API is up and running');
})