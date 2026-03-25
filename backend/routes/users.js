const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize");

router.post("/create", auth, authorize("admin"), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!["manager", "staff"].includes(role)) {
      return res.status(400).json({ message: "Role must be manager or staff" });
    }
    if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });

    res.status(201).json({ message: "User created", user: { id: user._id, name, email, role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;