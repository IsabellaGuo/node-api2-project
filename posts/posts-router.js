const express = require("express");
const Posts = require("../data/db.js");

const router = express.Router();

//GET - /api/posts

router.get("/", (req, res) => {
    Posts
    .find ()
    .then(posts => {
        console.log(posts);

        if (posts) {
            res.status(200).json(posts);
        } else {
            res.status(404).json({ errorMessage: "not found"});
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: "The post information could not be retrieved."})
    });
});

//GET - /api/posts/:id

router.get("/:id", (req, res) => {
    Posts
    .findById(req.params.id)
    .then(posts => {

        if (posts) {
            res.status(200).json(posts);
        } else {
            res.status(404).json({ errorMessage: "The post with the specified ID does not exist."});
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({ errorMessage: "The post information could not be retrieved."})
    })


})

//GET - /api/posts/:id/comments

router.get("/:id/comments", (req, res) => {
    Posts
    .findById(req.params.id)
    .then(posts => {

        if (posts) {

            Posts
            .findPostComments(req.params.id)
            .then(comments => {
                res.status(200).json(comments);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: "The comments information could not be retrieved." })
            })
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: "The post information could not be retrieved." });
    });
});










module.exports = router;
