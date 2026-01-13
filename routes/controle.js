const express = require("express");
const router = express.Router();
const Controle = require("../models/Controle");
const User = require("../models/User");

// ===== Middleware =====
function protect(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  next();
}

// ===== DASHBOARD =====
router.get("/dashboard", protect, async (req, res) => {
  try {
    const data = await Controle
      .find({ user: req.session.user.email })
      .sort({ createdAt: -1 });

    res.render("dashboard", { data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur dashboard");
  }
});

// ===== FORMULAIRE =====
router.get("/form", protect, (req, res) => {
  res.render("form");
});

// ===== ENREGISTRER (TEXTE UNIQUEMENT) =====
router.post("/form", protect, async (req, res) => {
  try {
    const controle = new Controle({
      date: String(req.body.date),
      mois: String(req.body.mois),
      groupe: String(req.body.groupe),
      k_option: String(req.body.k_option),
      ligne: String(req.body.ligne),

      table_t1: String(req.body.table_t1),
      table_t2: String(req.body.table_t2),
      table_t3: String(req.body.table_t3),

      cartons: String(req.body.cartons),
      pieces: String(req.body.pieces),
      etiquettes: String(req.body.etiquettes),
      edge: String(req.body.edge),
      surface: String(req.body.surface),
      broken: String(req.body.broken),

      user: String(req.session.user.email)
    });

    await controle.save();
    res.redirect("/dashboard");

  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur enregistrement");
  }
});

// ===== SUPPRESSION =====
router.post("/delete/:id", protect, async (req, res) => {
  try {
    await Controle.findByIdAndDelete(req.params.id);

    // Retourner à la page précédente ou dashboard si pas possible
    const prev = req.headers.referer || "/dashboard";
    res.redirect(prev);
    
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur suppression");
  }
});

// ===== RAPPORT GLOBAL =====
router.get("/rapport", protect, async (req, res) => {
  try {
    const controles = await Controle.find().sort({ date: 1 });
    const users = await User.find({}, { email: 1, nom: 1 });

    const mapNom = {};
    users.forEach(u => mapNom[u.email] = u.nom);

    const data = controles.map(c => ({
      ...c._doc,
      nom: mapNom[c.user] || c.user
    }));

    res.render("rapport", { data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur rapport");
  }
});

module.exports = router;
