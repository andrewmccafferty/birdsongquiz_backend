const speciesList = require('../data/species_list');

const arrayHelpers = require('../util/arrayHelpers');

const selectRandomSpecies = (level) => {
    let filteredSpeciesList = speciesList;
    if (level) {
        filteredSpeciesList = speciesList.filter((element) => {
            return element.level == level;
        });
    }
    let randomElement = arrayHelpers.getRandomArrayElement(filteredSpeciesList);
    return randomElement != null ? randomElement.ScientificName : null;
};

const listSpecies = () => {
    return speciesList;
}

module.exports = {
    selectRandomSpecies: selectRandomSpecies,
    listSpecies: listSpecies
}