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

//POST - /api/posts

router.post("/", (req, res) => {
    if (!(req.body && req.body.title && req.body.contents)) {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        });
        return true;
    } 

    Posts
    .insert(req.body)
    .then (post => {
        if (post) {
            res.status(201).json(post);
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: "There was an error while saving the post to the database" 
    });

    });
});


//POST - /api/posts/:id/comments

router.post("/:id/comments", (req, res) => {

    if ( !( req.body && req.body.text )) {
        res.status(400).json({
            message: "Please provide text for the comment."
        });
        return true;
    } 

    Posts
        .findById(req.params.id)
		.then(result => {
			if (result) {
				Posts.insertComment({
					text: req.body.text,
					post_id: req.params.id
				})
					.then(result => {
						res.status(201).json({ ...result, ...req.body });
					})
					.catch(err => {
						res.status(404).json({
							message:
								"There was an error while saving the comment to the database"
						});
					});
			} else {
				res.status(404).json({
					message: "The post with the specified ID does not exist."
				});
			}
		})
		.catch(err => {
			res.status(500).json({
				message: "There was an error while saving the comment to the database"
			});
		});
})






module.exports = router;
