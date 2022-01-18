const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PokemonSchema = new Schema({
  name: { type: String, required: true, maxLength: 20 },
  types: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Type',
    },
  ],
  moves: [String],
  image: String,
});

// Virtual for author's URL
PokemonSchema.virtual('url').get(function () {
  return '/pokemon/' + this._id;
});

module.exports = mongoose.model('Pokemon', PokemonSchema);
