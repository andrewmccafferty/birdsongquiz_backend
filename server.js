const express = require('express');
const request = require('request');
const speciesList = require('./species_list');

const app = express();
const port = process.env.PORT || 5000;

const getRandomArrayElement = (items) => {
    return items[Math.floor(Math.random()*items.length)];
}

const selectRandomSpecies = () => {
    let randomElement = getRandomArrayElement(speciesList);
    return randomElement.Species;
};
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/api/birdsong', (req, res) => {
    let species = selectRandomSpecies();
    let url = `https://www.xeno-canto.org/api/2/recordings?query=${encodeURIComponent(species)}`;
    request(url, function (error, response, body) {
            let parsedBody = JSON.parse(body);

            let recordings = parsedBody.recordings;

            if (!recordings || recordings.length == 0) {
                res.send({
                    noRecordings: true
                });
                return;
            }

            let randomRecording = getRandomArrayElement(recordings);
            console.log('error:', error); // Print the error if one occurred and handle it
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            res.setHeader('Content-Type', 'application/json');
            res.send({
                recording: randomRecording
            });
        });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
