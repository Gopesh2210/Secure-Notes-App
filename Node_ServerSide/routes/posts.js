const express = require('express');
const router  = express.Router();

const checkAuth = require('../middleware/check-auth');
const postController = require('../controller/posts');
const extractImageFile = require('../middleware/imageFile')





// posting data api
router.post('',checkAuth,extractImageFile,postController.createPost );

// fetching data api
router.get('',checkAuth,postController.fetchPosts );

// deleting data api
router.delete('/:id',checkAuth, postController.deletePosts);

// editing  data api
router.put('/:id',checkAuth,extractImageFile, postController.editPosts);

// returning edit data
router.get('/:id', postController.fetchEditablePost);

module.exports = router;