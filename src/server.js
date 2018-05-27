const express = require('express');
const speciesService = require('./service/species');
const recordingsService = require('./service/recordings');
const quizService = require('./service/quiz');
const app = express();
const port = process.env.PORT || 5000;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/api/species', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        species: speciesService.listSpecies()
    });
});

app.get('/api/birdsong', (req, res) => {
    let level = req.query.level;
    quizService.getChallenge(level).then((result) => {
        res.send(result);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
