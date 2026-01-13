const mongoose = require("mongoose");

const controleSchema = new mongoose.Schema({
  date: String,
  mois: String,
  groupe: String,
  k_option: String,
  ligne: String,

  table_t1: String,
  table_t2: String,
  table_t3: String,

  cartons: String,
  pieces: String,
  etiquettes: String,
  edge: String,
  surface: String,
  broken: String,

  user: String
}, { timestamps: true });

module.exports = mongoose.model("Controle", controleSchema);
