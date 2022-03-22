const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
},
    { timestamps: true }

);

UserSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
        expiresIn: "2d",
    });
    return token;
};

const validate = (data) => {
    const schema = Joi.object({
        username: Joi.string().required().label("username"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
    });
    return schema.validate(data);
};

const User = mongoose.model("User", UserSchema);


// module.exports = mongoose.model("User", UserSchema)

module.exports = { User, validate };


