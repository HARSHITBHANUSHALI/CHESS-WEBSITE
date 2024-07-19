const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const User = require('../models//User')
const photosMiddleware = multer({dest:'uploads'});
router.post('/',photosMiddleware.array('photos',1),async (req,res)=>{
    try{
        if (req.files && req.files.length > 0){
            const uploadedPhoto = [];
            const {path,originalname} = req.files[0];
            const parts = originalname.split('.');
            const ext = parts[parts.length-1];
            const newPath = path + '.' + ext;
            fs.renameSync(path,newPath);
            uploadedPhoto.push(newPath.replace('uploads\\',''));
            const foundUser = await User.findOne({username:req.headers['username']}).exec();
            if(foundUser){
                foundUser.photos.pop();
                foundUser.photos.push(uploadedPhoto[0]);
                await foundUser.save();
                res.json(uploadedPhoto[0]);
            }else{
                res.status(404).json({error:'User not found.'});
            }
        }else{
            res.status(400).json({error:'No photo was uploaded.'});
        }
    }catch(err){
        console.error(err);
        res.status(500).json({error:'An error occured while uploading the photo'});
    }

})

module.exports = router;