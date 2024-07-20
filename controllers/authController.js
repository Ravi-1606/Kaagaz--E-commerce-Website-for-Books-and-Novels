const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async function(req, res) {
    try {
        const { email, password, fullname } = req.body;

        let user = await userModel.findOne({ email: email });
        if (user) {
            req.flash("error", "You already have an account. Please log in.");
            return res.redirect("/");
        }

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) {
                    req.flash("error", "Error hashing password. Please try again.");
                    return res.redirect("/");
                }

                try {
                    let newUser = await userModel.create({
                        email,
                        password: hash,
                        fullname,
                    });

                    let token = generateToken(newUser);
                    res.cookie("token", token);

                    req.flash("success", "User registered successfully!");
                    res.redirect("/shop");
                } catch (error) {
                    req.flash("error", error.message);
                    res.redirect("/");
                }
            });
        });

    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/");
    }
};

module.exports.loginUser = async function(req, res) {
    try {
        const { email, password } = req.body;

        let user = await userModel.findOne({ email: email });
        if (!user) {
            req.flash("error", "Email or password incorrect.");
            return res.redirect("/");
        }

        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash("error", "Email or password incorrect.");
            return res.redirect("/");
        }

        let token = generateToken(user);
        res.cookie("token", token);

        res.redirect("/shop");

    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/");
    }
};

module.exports.logout = function(req, res) {
    res.clearCookie("token");
    req.flash("success", "Logged out successfully.");
    res.redirect("/");
};
