const router = require("express").Router();
const Notification = require("../models/Notification");

router.post("/add", async (req, res) => {
    try {
        const notif = new Notification(req.body);
        res.status(201).json(await notif.save());
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({
                errors: Object.values(err.errors).map(e => e.message)
            });
        }
        res.status(500).json({ message: err.message });
    }
});

router.get("/", async (req, res) => {
    try {
        res.json(await Notification.find().populate("recipient"));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const updated = await Notification.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ message: "Notification not found" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const deleted = await Notification.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Notification not found" });
        res.json({ message: "Notification deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
