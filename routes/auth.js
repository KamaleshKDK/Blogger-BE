const router = require("express").Router();
const { User, validate } = require("../models/User");
const bcrypt = require("bcrypt");
const Joi = require("joi");


//REGISTER

router.post("/register", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(409)
        .send({ message: "User with given email already Exist!" });
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });
    await new User({ ...req.body, password: hashedPass }).save();
    // const user = await newUser.save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

//LOGIN

// router.post("/login", async (req, res) => {


  // try {
  //   const user = await User.findOne({ username: req.body.username });
  //   !user && res.status(400).json("Wrong credentials!");

  //   const validated = await bcrypt.compare(req.body.password, user.password);
  //   !validated && res.status(400).json("Wrong credentials!");

  //   const { password, ...others } = user._doc;
  //   res.status(200).json(others);
  // } catch (err) {
  //   res.status(500).json(err);
  // }

// });

module.exports = router;