const FlatModel = require("../models/FlatModel");

const checkFlat = async (req, res, next) => {
    try {
        const flat = await FlatModel.findById(req.params.id);
        if (!flat) {
            return res.status(404).json({ message: "Flat not found" });
        }

        req.flat = flat;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    checkFlat,
};
