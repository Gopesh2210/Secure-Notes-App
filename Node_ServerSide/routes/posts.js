const express = require('express');
const Post = require('../models/post');
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');

const router  = express.Router();


const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
  };
  
  // handling image storage in backend
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid mime type");
      if (isValid) {
        error = null;
      }
      cb(error, "images");
    },
    filename: (req, file, cb) => {
      const name = file.originalname
        .toLowerCase()
        .split(" ")
        .join("-");
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, name + "-" + Date.now() + "." + ext);
    }
  });


// posting data api
router.post('',checkAuth,multer({ storage: storage }).single("image"), (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });

    post.save().then((addedPost) => {
        res.status(201).json({
            message: 'Post added succesfully',
            post:{
                id: addedPost._id,
                title: addedPost.title,
                content: addedPost.content,
                imagePath: addedPost.imagePath
            }
        });
    }).catch(error =>{
        res.status(500).json({
            message: "Creation of post failed!"
        })
    });
  
});

// fetching data api
router.get('',checkAuth, (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.currentPage;
    const creator = req.userData.userId;
    const postQuery = Post.find({creator: creator});

    let fetchedPosts;

    // console.log(req.query);
    
    if(pageSize && currentPage){
        postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }

    postQuery
    .then(documents =>{
        fetchedPosts = documents;
        return Post.count({creator: creator});
    })
    .then(count => {    
        res.status(200).json({
            message: 'Posts fetched successfully!',
            posts: fetchedPosts,
            maxPosts: count
        });
    }).catch(error =>{
        res.status(500).json({
            message: "Fetching posts failed!"
        })
    })
    });

// deleting data api
router.delete('/:id',checkAuth, (req, res, next) => {
    Post.deleteOne({ _id: req.params.id,creator: req.userData.userId}).then((result) => {
        if(result.n > 0){
            res.status(200).json({
                message: 'Post deleted successfully!',
            });
        } else{
            res.status(401).json({
                message: 'Unauthorized User!'
            });
        }
    }).catch(error =>{
        res.status(500).json({
            message: "Could not delete post!"
        })
    });
});

// editing  data api
router.put('/:id',checkAuth,multer({ storage: storage }).single("image"), (req, res, next) => {
    let imagePath = req.body.imagePath;
    if(req.file){
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    Post.updateOne({_id: req.params.id, creator: req.userData.userId},post).then((result) => {
        if(result.nModified > 0){
            res.status(200).json({
                message: 'Post edited successfully!',
            });
        } else{
            res.status(401).json({
                message: 'Unauthorized User!'
            });
        }
       
    }).catch(error =>{
        res.status(500).json({
            message: "Could not update post!"
        })
    })
});

// returning edit data
router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id).then((post) => {
        if(post){
            res.status(200).json(post);
        }else{
            res.status(404).json({
                message: 'Post not found!',
            });
        }
       
    }).catch(error =>{
        res.status(500).json({
            message: "Fetching post failed!"
        })
    });
});

module.exports = router;