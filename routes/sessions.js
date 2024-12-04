import express from "express";
import passport from "passport";

const router = express.Router();

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }
    res.json({
      message: "Usuario autenticado",
      user: {
        id: req.user._id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role,
      },
    });
  }
);

export default router;
