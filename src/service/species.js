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
    const primaryGroup = givenSpecies.PrimaryGroup
    const level = givenSpecies.Level
    const groups = givenSpecies.Groups
    const primaryGroupMatch = findSpeciesWithMatchingPrimaryGroupAndLevel(primaryGroup, level)
    const groupMatch = findSpeciesWithMatchingGroupAndLevel(groups, level)
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
    findRandomMatchesForLevel(level, numberNeeded).map(option => options.push(option))
    return options
}

const findRandomMatchesForLevel = (level, numberNeeded) => {
    return _.times(numberNeeded, () => arrayHelpers.getRandomArrayElement(filterSameLevelMatches(level, speciesList)))
}

const filterSameLevelMatches = (level, matches) => {
    console.log('matches were', matches)
    const result = level ? matches.filter(species => species.Level === level) : matches
    console.log('same level matches', result)
    return result
}

const findSpeciesWithMatchingPrimaryGroupAndLevel = (primaryGroup, level) => {
    if (!primaryGroup) {
        return null
    }
    const samePrimaryGroupMatches = speciesList.filter(species => species.PrimaryGroup === primaryGroup)
    if (!samePrimaryGroupMatches) {
        return null
    }
    return arrayHelpers.getRandomArrayElement(filterSameLevelMatches(level, samePrimaryGroupMatches))
}

const findSpeciesWithMatchingGroupAndLevel = (groups, level) => {
    if (!groups || groups.length === 0) {
        return null
    }
    const sameGroupMatches = speciesList.filter(species => groups.includes(species.groups))
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