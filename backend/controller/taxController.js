const Tax = require("../models/Tax");

// Get all active taxes
const getTaxes = async (req, res) => {
  try {
    const taxes = await Tax.find({ status: "active" }).sort({ rate: 1 });
    res.send(taxes);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Create a new tax
const addTax = async (req, res) => {
  try {
    const { name, rate, status } = req.body;

    if (!name || rate === undefined) {
      return res
        .status(400)
        .send({ message: "Tax name and rate are required." });
    }

    const tax = new Tax({
      name: name.trim(),
      rate: Number(rate),
      status: status || "active",
    });

    await tax.save();

    res.status(201).send(tax);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Delete a tax
const deleteTax = async (req, res) => {
  try {
    const tax = await Tax.findByIdAndDelete(req.params.id);

    if (!tax) {
      return res.status(404).send({ message: "Tax not found" });
    }

    res.send({ message: "Tax deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  getTaxes,
  addTax,
  deleteTax,
};


