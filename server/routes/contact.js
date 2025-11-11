const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const contact = new Contact({ name, email, message });
    await contact.save();

    res.status(200).json({ success: true, message: "Contact saved successfully" });
  } catch (error) {
    console.error("Contact save error:", error);
    res.status(500).json({ error: "DB save error" });
  }
});

module.exports = router;