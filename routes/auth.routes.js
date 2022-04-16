const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const validate = require("../middlewares/validate.middleware");
const { authenticate } = require("../middlewares/jwt.middleware");
const { body } = require("express-validator");

const router = express.Router();

router.post(
  "/signup",
  validate([
    body("username").isLength({ min: 5 }),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ]),
  async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        email,
        password: passwordHash,
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

router.post(
  "/login",
  validate([body("email").isEmail(), body("password").isLength({ min: 6 })]),
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user) {
        const passwordCorrect = await bcrypt.compare(password, user.password);
        if (passwordCorrect) {
          const payload = {
            user,
          };
          const token = jwt.sign(payload, process.env.JWT_SECRET, {
            algorithm: "HS256",
            expiresIn: "6h",
          });
          res.status(200).json({ user, token });
        } else {
          res.status(401).json({ message: "Email or password are incorrect" });
        }
      } else {
        res.status(401).json({ message: "Email or password are incorrect" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// The client makes a API request to this url sending the data in the body
router.post("/google/info", (req, res) => {
  const { firstName, lastName, email, image, googleId } = req.body;
  // the name itself will include the last name
  try {
    // Create the user in the DB
    User.create({ firstName, lastName, googleId, image, email }).then(
      (response) => {
        // Save the loggedInInfo in the session
        // We'll stick to using sessions just to not over complicate the students with tokens and cookies
        res.status(200).json({ data: response });
      }
    );
  } catch (error) {
    res.status(500).json({ error: `${error}` });
  }
});

router.get("/verify", authenticate, (req, res) => {
  res.status(200).json({
    user: req.jwtPayload.user,
  });
});

router.get("/profile", authenticate, async (req, res) => {
  const user = await User.findById(req.jwtPayload.user._id);
  res.status(200).json(user);
});

module.exports = router;
