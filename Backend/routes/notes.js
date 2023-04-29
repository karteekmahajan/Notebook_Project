const express = require('express');
const router = express.Router();
var fetchuser = require('./middleware/fetchuser')
const Note = require("../models/Note");
const { body, validationResult } = require('express-validator');


// Route-1: get all notes using GET "/api/notes/getuser".login is required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }

})

// Route-2: Add a new Note using POST "/api/notes/addnote".login is require
router.post('/addnote', fetchuser, [
    body('title', 'enter a valid title').isLength({ min: 3 }),
    body('description', 'description must be 5 character').isLength({ min: 5 }),], async (req, res) => {
        try {
            const { title, description, tag } = req.body;
            // if errors return a bad request and error
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            const note = new Note({
                title, description, tag, user: req.user.id
            })
            const saveNote = await note.save()
            res.status(200).json(saveNote)
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error");
        }

    })

// Route-3: update a existing  Note using POST "/api/notes/updatenote".login is require
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;

    // create a newNote object
    try {
        const newNote = {};
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        // find the node to be updated and update it

        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("not Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(404).send("not Found")
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

// Route-4: delete a existing  Note using delete "/api/notes/deletenote".login is require
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    
try {

    // find the node to be updated and update it

        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("not Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(404).send("not Found")
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "success": "Note has been deleted", note: note });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})


module.exports = router