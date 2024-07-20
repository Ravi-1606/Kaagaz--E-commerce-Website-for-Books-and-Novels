const express = require("express");
const router = express.Router();
const Product = require("../models/product-model");
const isLoggedin = require("../middlewares/isLoggedin");
const userModel = require("../models/user-model");

router.get("/", function(req, res) {
    let error = req.flash("error");
    res.render("index", { error, loggedin: false });
});


router.get("/shop", isLoggedin, async function(req, res) {
    try {
        let products = await Product.find().exec();
        let success = req.flash("success");
        res.render("shop", { products, success });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get("/cart", isLoggedin, async function(req, res) {
    try {
        let user = await userModel
            .findOne({ email: req.user.email })
            .populate("cart"); 
        res.render("cart", { user });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get("/addtocart/:productid", isLoggedin, async function(req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        if (!user.cart.includes(req.params.productid)) {
            user.cart.push(req.params.productid);
            await user.save();
            req.flash("success", "Added to cart");
        } else {
            req.flash("error", "Product already in cart");
        }
        res.redirect("/shop");
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
