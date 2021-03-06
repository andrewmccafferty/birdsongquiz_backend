const express = require('express');
const speciesService = require('./service/species');
const recordingsService = require('./service/recordings');
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

app.get('/api/birdsong', async (req, res) => {
    let level = parseInt(req.query.level);
    let speciesResult = speciesService.selectRandomSpecies(level);
    if (!speciesResult) {
        res.send({ noRecordingFound: true});
        return;
    }

    recordingsService.getRandomRecording(speciesResult.selectedSpecies).then((result) => {
        res.send({
            "multipleChoiceOptions": speciesResult.multipleChoiceOptions,
            "recordingResult": result
        });
    });
});

app.get('/api/birdsong/head-to-head', async (req, res) => {
    let speciesResult = speciesService.selectRandomSpeciesFromFixedList(req.query.species)
    if (!speciesResult) {
        res.send({ noRecordingFound: true});
        return;
    }

    recordingsService.getRandomRecording(speciesResult.selectedSpecies).then((result) => {
        res.send({
            "multipleChoiceOptions": speciesResult.multipleChoiceOptions,
            "recordingResult": result
        });
    });
});

app.get('/api/test', (req, res) => {
    var ip = req.header('x-forwarded-for') || req.connection.remoteAddress
    console.log(`ip captured was ${ip}`)
    res.send({yourIp: ip})
});

app.listen(port, () => console.log(`Listening on port ${port}`));
