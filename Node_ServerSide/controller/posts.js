const Post = require('../models/post');


exports.createPost = (req, res, next) => {
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
  
};

exports.fetchPosts = (req, res, next) => {

    // the IF checks whether or not the user is authenticated before routing to home page
    if(!req.userData){
        res.status(200).json({
            message: "Welcome to the home page"
        })
    }

    else{
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
        return Post.countDocuments({creator: creator});
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
 }
};

exports.deletePosts = (req, res, next) => {
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
};

exports.editPosts = (req, res, next) => {
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
        if(result.n > 0){
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
};

exports.fetchEditablePost = (req, res, next) => {
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
};