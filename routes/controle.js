const express = require("express");
const router = express.Router();
const Controle = require("../models/Controle");
const User = require("../models/User");

// Middleware pour protéger les routes
function protect(req, res, next) {
  if (!req.session.user) return res.redirect("/auth/login");
  next();
}

// =================== DASHBOARD ===================
router.get("/dashboard", protect, async (req, res) => {
  try {
    const data = await Controle.find({ user: req.session.user.email });
    res.render("dashboard", { data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de l'affichage du dashboard");
  }
});

// =================== FORMULAIRE QC ===================
router.get("/form", protect, (req, res) => {
  res.render("form");
});

// =================== ENREGISTRER FORMULAIRE ===================
router.post("/form", protect, async (req, res) => {
  try {
    await Controle.create({
      ...req.body, // inclut k_option
      user: req.session.user.email
    });
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de l'enregistrement du formulaire");
  }
});

// =================== SUPPRIMER UNE LIGNE ===================
router.post("/rapport/delete/:id", protect, async (req, res) => {
  try {
    await Controle.findByIdAndDelete(req.params.id);
    res.redirect("/rapport"); // Retour sur la page rapport
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la suppression");
  }
});

// =================== RAPPORT GLOBAL ===================
router.get("/rapport", protect, async (req, res) => {
  try {
    const controles = await Controle.find();
    const users = await User.find({}, { email: 1, nom: 1 });

    // Map email -> nom
    const emailToNom = {};
    users.forEach(u => { emailToNom[u.email] = u.nom; });

    const data = controles.map(c => ({
      ...c._doc,
      nom: emailToNom[c.user] || c.user
    }));

    res.render("rapport", { data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de l'affichage du rapport");
  }
});

module.exports = router;
