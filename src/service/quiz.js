const speciesService = require('./species');
const recordingsService = require('./recordings');

const getChallenge = (level) => {
    let species = speciesService.selectRandomSpecies(level);
    if (!species) {
        return Promise.resolve({ noRecordingFound: true});
    }

    return recordingsService.getRandomRecording(species).then((result) => {
        return Promise.resolve(result);
    });
}

module.exports =  {
    getChallenge: getChallenge
}