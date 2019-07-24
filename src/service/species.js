const speciesList = require('../data/species_list');
const _ = require('lodash')
const arrayHelpers = require('../util/arrayHelpers');

const selectRandomSpecies = (level) => {
    let filteredSpeciesList = speciesList;
    if (level) {
        filteredSpeciesList = speciesList.filter((element) => {
            return element.Level === level;
        });
    }
    let randomElement = arrayHelpers.getRandomArrayElement(filteredSpeciesList);
    if (randomElement == null) {
        return null
    }
    const multipleChoiceOptions = getMultipleChoiceOptions(level, randomElement, 4)
    return { selectedSpecies: randomElement.ScientificName, multipleChoiceOptions }
};

const getMultipleChoiceOptions = (level, givenSpecies, numberOfOptions = 4) => {
    const options = [givenSpecies]
    let numberNeeded = numberOfOptions - 1
    const addPrimaryGroupMatch = () => {
        const primaryGroupMatch = findSpeciesWithMatchingPrimaryGroupAndLevel(givenSpecies, level, options)
        if (primaryGroupMatch) {
            options.push(primaryGroupMatch)
            numberNeeded--
        }
    }
    _.times(numberOfOptions - 1, () => addPrimaryGroupMatch())
    findRandomMatchesForLevel(level, numberNeeded, options).map(option => options.push(option))
    return _.shuffle(options)
}

const findRandomMatchesForLevel = (level, numberNeeded, exclusions) => {
    const allExclusions = [...exclusions]
    return _.times(numberNeeded, () => {
        const selectedSpecies = arrayHelpers.getRandomArrayElement(filterSameLevelMatches(level, speciesList, allExclusions))
        allExclusions.push(selectedSpecies)
        return selectedSpecies
    })
}
const speciesExcluded = (species, exclusions) => exclusions.some(excludedSpecies => excludedSpecies.ScientificName.toUpperCase() === species.ScientificName.toUpperCase())

const filterSameLevelMatches = (level, matches, exclusions) => {
    const result = level ? matches.filter(species => species.Level <= level && !speciesExcluded(species, exclusions)) : matches
    return result
}

const findSpeciesWithMatchingPrimaryGroupAndLevel = (givenSpecies, level, exclusions = []) => {
    if (!givenSpecies.primaryGroup) {
        return null
    }
    const samePrimaryGroupMatches = speciesList.filter(species => species.primaryGroup === givenSpecies.primaryGroup &&
        !speciesExcluded(species, exclusions))
    if (samePrimaryGroupMatches.length === 0) {
        return null
    }
    return arrayHelpers.getRandomArrayElement(filterSameLevelMatches(level, samePrimaryGroupMatches, exclusions))
}

const listSpecies = () => {
    return speciesList;
}

module.exports = {
    selectRandomSpecies: selectRandomSpecies,
    listSpecies: listSpecies
}