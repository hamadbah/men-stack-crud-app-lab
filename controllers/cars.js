const Car = require('../models/car'); // Must (Model Name Change by Project) assign the model name 
const upload = require('../upload');

const router = require('express').Router(); // Must
const fs = require('fs');
const path = require('path');

router.get("/", async (req, res) => {
  res.render("index.ejs");
});

router.get("/cars/new", async (req, res) =>{
    res.render("cars/new.ejs")
});

router.post("/cars",upload.single("image"), async (req, res) => {
    if (req.body.isReadyToDrive === 'on'){
        req.body.isReadyToDrive = true;
    } else {
        req.body.isReadyToDrive = false;
    }

    if (req.file) {
        req.body.image = req.file.filename; // Save only the filename
    }

    await Car.create(req.body);
    res.redirect("/cars/new");
})

router.get("/cars", async (req, res) => {
    const cars = await Car.find(); // Model name . find () -- Fetch all the records in the variable.
    res.render("cars/index.ejs", { cars });
});

// Read One - Show Functionallty 
router.get("/cars/:carId", async (req, res) => {
    const car = await Car.findById(req.params.carId);
    res.render("cars/show.ejs", { car });
});

// Edit - Get
router.get("/cars/:carId/edit", async (req, res) => {
    const car = await Car.findById(req.params.carId);
    res.render("cars/edit.ejs", { car });
});

// Update - PUT
router.put("/cars/:carId", upload.single("image"), async (req, res) => {
    const car = await Car.findById(req.params.carId);
    if (req.body.isReadyToDrive === "on"){
        req.body.isReadyToDrive = true;
    } else {
        req.body.isReadyToDrive = false;
    }

    // Handle image: use new file or keep old one
    if (req.file) {
        // Delete old image file
        if (car.image) {
            const oldImagePath = path.join(__dirname, "..", "uploads", car.image);
            fs.unlink(oldImagePath, (err) => {
            if (err) console.error("Error deleting old image:", err);
            });
        }

        req.body.image = req.file.filename; // New image uploaded
    } else {
        req.body.image = req.body.existingImage; // Keep existing image
    }

    await Car.findByIdAndUpdate(req.params.carId, req.body);
    res.redirect(`/cars/${req.params.carId}`);
});

// Delete 
router.delete("/cars/:carId", async (req, res) => {
    const car = await Car.findById(req.params.carId);
    if (car.image) {
        const imagePath = path.join(__dirname, "..", "uploads", car.image);
        fs.unlink(imagePath, (err) => {
            if (err) console.error("Error deleting image:", err);
        });
    }
    await Car.findByIdAndDelete(req.params.carId);
    res.redirect("/cars");
})


module.exports = router; // Must