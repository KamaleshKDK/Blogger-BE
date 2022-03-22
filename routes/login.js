const router = require("express").Router();
const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const Joi = require("joi");




//LOGIN

router.post("/login", async (req, res) => {


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

    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const user = await User.findOne({ username: req.body.username });
        if (!user)
            return res.status(401).send({ message: "Invalid Username or Password" });

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword)
            return res.status(401).send({ message: "Invalid Username or Password" });

        const token = user.generateAuthToken();
        res.status(200).send({ data: token, message: "logged in successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});


const validate = (data) => {
    const schema = Joi.object({
        username: Joi.string().text().required().label("Username"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
};
module.exports = router;