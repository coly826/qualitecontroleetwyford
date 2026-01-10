const mongoose = require("mongoose");

const controleSchema = new mongoose.Schema({
  date: String,
  mois: String,
  groupe: String,
  k_option: String,   // 👈 AJOUT
  cartons: String,
  pieces: String,
  etiquettes: String,
  edge: String,
  surface: String,
  broken: String,
  user: String
});

module.exports = mongoose.model("Controle", controleSchema);
