//const quiz = require('./../src/service/quiz')
const proxyquire = require('proxyquire')
const assert = require('assert')
const sinon = require('sinon')
const speciesService = require('../src/service/species');
const recordingsService = require('../src/service/recordings');

describe('Quiz tests', function() {
  const level = 1
  const testSpecies = 'common sandpiper'
  var quiz = null
  var selectRandomSpeciesStub = null
  var getRandomRecordingStub = null
  before(() => {
    selectRandomSpeciesStub = sinon.stub(speciesService, 'selectRandomSpecies')
    getRandomRecordingStub = sinon.stub(recordingsService, 'getRandomRecording')
    getRandomRecordingStub.resolves(null)
    quiz = proxyquire('../src/service/quiz', 
        { 
          './species': {
            selectRandomSpecies: selectRandomSpeciesStub
          },
          './recordings': {
            getRandomRecording: getRandomRecordingStub
          }
        })
  })

  describe('getChallenge', function() {
    it('Should return no species found when species service does not return a result', (done) => {
        quiz.getChallenge(1).then((result) => {
          assert.equal(result.noSpeciesFound, true, "NoSpeciesFound should be true")
          done()
        }).catch(done)
    });

    it('Should return no recording found when recordings service does not return a result', (done) => {
      selectRandomSpeciesStub.withArgs(level).returns(testSpecies)
      quiz.getChallenge(1).then((result) => {
        assert.equal(result.noRecordings, true, 'noRecordings should be true')
        done()
      }).catch(done)
    });

    it('Should return the recording that the recording service returns when there is one', (done) => {
      const recordingResult = {'url': 'testurl'}
      selectRandomSpeciesStub.withArgs(level).returns(testSpecies)
      getRandomRecordingStub.withArgs(testSpecies).resolves(recordingResult)
      quiz.getChallenge(1).then((result) => {
        assert.equal(result.recording, recordingResult, 'The specified recording should have been returned')
        done()
      }).catch(done)
    });

  });
});