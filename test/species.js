const proxyquire = require('proxyquire')
const assert = require('assert')
const sinon = require('sinon')

const arrayHelpers = require('../src/util/arrayHelpers');

var speciesService = null
  var getRandomArrayElementStub = null
  var speciesList = [
    {
        "Species": "Brent Goose",
        "ScientificName": "Branta bernicla",
        "Level": 3,
        "Habitat": "estuary"
    },
    {
        "Species": "Blackbird",
        "ScientificName": "Turdus merula",
        "Level": 1,
        "Habitat": "garden"
    },
    {
        "Species": "Red-breasted Goose",
        "ScientificName": "Branta ruficollis",
        "Level": 5,
        "Habitat": "estuary"
    },
    {
        "Species": "Robin",
        "ScientificName": "Erithacus rubecula",
        "Level": 1,
        "Habitat": "garden"
    }
];
  describe('Species service tests', () => {
    before(() => {
        getRandomArrayElementStub = sinon.stub(arrayHelpers, 'getRandomArrayElement')
        speciesService = proxyquire('../src/service/species', 
            { 
                '../data/species_list': speciesList,
                '../util/arrayHelpers': {
                getRandomArrayElement: getRandomArrayElementStub
              }
            })
      })

      it('Should return the correct level species when asked for a random species', (done) => {
            // Arrange
            getRandomArrayElementStub.withArgs().returns
            // Act
            const species = speciesService.selectRandomSpecies(1)
            
            // Assert
            assert.equal(species, 'Turdus merula', 'Species selected should be Turdus merula')
      })
  })