const requestPromise = require('request-promise');
const arrayHelpers = require('../util/arrayHelpers');

const getImageForSpecies = async (species) => {
    try {
        const url = `https://api.flickr.com/services/feeds/photos_public.gne?tags=${encodeURIComponent(species)}&format=json&nojsoncallback=1`
        const response = await requestPromise(url)
        const parsedResponse = JSON.parse(response)
        const getImageFromResponse = () => {
            const item = parsedResponse.items[0]
            return {
                imageUrl: item.media["m"],
                flickrLink: item.link,
                photographer: item.author
            }
        }
        return getImageFromResponse()
    } catch (e) {
        console.error('Error retrieving image from Flickr', e)
        return null
    }
}

const getRandomRecording = async (species) => {
    let url = `https://www.xeno-canto.org/api/2/recordings?query=${encodeURIComponent(species)}`;
    let body = await requestPromise(url);
    const imageResult = await getImageForSpecies(species)
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
        recording: randomRecording,
        image: imageResult
    };
};

module.exports = {
    getRandomRecording: getRandomRecording
}