const speciesList = require('../data/species_list');
const _ = require('lodash')
const arrayHelpers = require('../util/arrayHelpers');

const selectRandomSpecies = (level) => {
    let filteredSpeciesList = speciesList;
    if (level) {
        filteredSpeciesList = speciesList.filter((element) => {
            return element.Level == level;
        });
    }
    let randomElement = arrayHelpers.getRandomArrayElement(filteredSpeciesList);
    if (randomElement == null) {
        return null
    }
    const multipleChoiceOptions = getMultipleChoiceOptions(randomElement, 4)
    return { selectedSpecies: randomElement.ScientificName, multipleChoiceOptions }
};

const getMultipleChoiceOptions = (givenSpecies, numberOfOptions = 4) => {
    const level = givenSpecies.Level
    const primaryGroupMatch = findSpeciesWithMatchingPrimaryGroupAndLevel(givenSpecies, level)
    const groupMatch = findSpeciesWithMatchingGroupAndLevel(givenSpecies, level)
    const options = [givenSpecies]
    let numberNeeded = numberOfOptions - 1
    if (primaryGroupMatch) {
        options.push(primaryGroupMatch)
        numberNeeded--
    }
    if (groupMatch) {
        options.push(groupMatch)
        numberNeeded--
    }
    findRandomMatchesForLevel(level, numberNeeded, options).map(option => options.push(option))
    return options
}

const findRandomMatchesForLevel = (level, numberNeeded, exclusions) => {
    return _.times(numberNeeded, () => {
        const selectedSpecies = arrayHelpers.getRandomArrayElement(filterSameLevelMatches(level, speciesList, exclusions))
        return selectedSpecies
    })
}

const filterSameLevelMatches = (level, matches, exclusions) => {
    const speciesExcluded = species => exclusions.some(excludedSpecies => excludedSpecies.ScientificName.toUpperCase() === species.ScientificName.toUpperCase())
    const result = level ? matches.filter(species => species.Level === level && !speciesExcluded(species)) : matches
    return result
}

const findSpeciesWithMatchingPrimaryGroupAndLevel = (givenSpecies, level) => {
    if (!givenSpecies.primaryGroup) {
        return null
    }
    const samePrimaryGroupMatches = speciesList.filter(species => species.PrimaryGroup === givenSpecies.primaryGroup && species != givenSpecies)
    if (!samePrimaryGroupMatches) {
        return null
    }
    return arrayHelpers.getRandomArrayElement(filterSameLevelMatches(level, samePrimaryGroupMatches))
}

const findSpeciesWithMatchingGroupAndLevel = (givenSpecies, level) => {
    const groups = givenSpecies.groups
    if (!groups || groups.length === 0) {
        return null
    }
    const sameGroupMatches = speciesList.filter(species => groups.includes(species.groups) && species != givenSpecies)
    if (!sameGroupMatches) {
        return null
    }
    return arrayHelpers.getRandomArrayElement(filterSameLevelMatches(level, sameGroupMatches))
}

const listSpecies = () => {
    return speciesList;
}

module.exports = {
    selectRandomSpecies: selectRandomSpecies,
    listSpecies: listSpecies
}