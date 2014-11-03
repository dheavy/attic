var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SentimentAnalysisSchema = new Schema({
  source:       { type: String, required: true },
  analysis:     { type: Object, required: true },
  score:        { type: Number, required: true },
  numOfEntries: { type: Number, required: true },
  average:      { type: Number, required: true },
  created:      { type: Date, default: Date.now, index: true, required: true }
});

mongoose.model('SentimentAnalysis', SentimentAnalysisSchema);
module.exports = mongoose;