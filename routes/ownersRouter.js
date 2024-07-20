const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");

if (process.env.NODE_ENV === "development") {
    router.post("/create", async (req, res) => {
        try {
    
            const owners = await ownerModel.find();
            if (owners.length > 0) {
                return res.status(403).send("Permission denied: Cannot create new owner.");
            }

            const { fullname, email, password } = req.body;

            const createdOwner = await ownerModel.create({
                fullname,
                email,
                password,
            });

            req.flash("success", "Owner created successfully!");

            res.status(201).send(createdOwner);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    });
}

router.get("/admin", (req, res) => {
    let success = req.flash("success");
    res.render("createproducts", { success }); 
});

module.exports = router;
