const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const PostModel = require('../models/PostModel');


router.get('/', authorize, (request, response) => {

    // Endpoint to get posts of people that currently logged in user follows or their own posts

    PostModel.getAllForUser(request.currentUser.id, (postIds) => {

        if (postIds.length) {
            PostModel.getByIds(postIds, request.currentUser.id, (posts) => {
                response.status(201).json(posts)
            });
            return;
        }
        response.json([])

    })

});

router.post('/', authorize,  (request, response) => {
    //console.log(request.body)

   let postData = {
        userId:request.currentUser.id,
        text:request.body.text,
        media:request.body.media
    };
    PostModel.create(postData,(posts) => {
        response.status(201).json(posts)
    });
    return;

});


router.put('/:postId/likes', authorize, (request, response) => {
    // Endpoint for current user to like a post
    PostModel.like(request.currentUser.id, request.params.postId, (likes) => {
        response.status(201).json(likes)
    });
    return;
});

router.delete('/:postId/likes', authorize, (request, response) => {
    // Endpoint for current user to unlike a post
    PostModel.unlike(request.currentUser.id, request.params.postId, (likes) => {
        response.status(201).json(likes)
    });
    return;
});

module.exports = router;
