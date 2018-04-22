const requestPromise = require('request-promise');
const arrayHelpers = require('../util/arrayHelpers');

const getRandomRecording = (species) => {
    let url = `https://www.xeno-canto.org/api/2/recordings?query=${encodeURIComponent(species)}`;
    return requestPromise(url).then((body) => {
        let parsedBody = JSON.parse(body);

        let recordings = parsedBody.recordings;

        if (!recordings || recordings.length == 0) {
            return {
                noRecordings: true
            };
        }

        let randomRecording = arrayHelpers.getRandomArrayElement(recordings);
        if (!randomRecording) {
            return {
                noRecordings: true
            };
        }
        return {
            recording: randomRecording
        };
    });
};

module.exports =  {
    getRandomRecording: getRandomRecording
}