const express = require('express');
const { requireSignin } = require('../middleware/authMiddleware');
const { getFriend, sendFriend, respondFriend, accept, reject, getfriendandrequest, unfriend, findTenuser } = require('../controller/friendContoller');
const router=express.Router();

router.post('/searchUser',requireSignin,getFriend)
router.post('/requist/:id',requireSignin,sendFriend)
// router.post('/respond',requireSignin,respondFriend)
router.post('/accept/:id',requireSignin,accept)
router.post('/reject/:id',requireSignin,reject)

router.post('/getfriend',requireSignin,getfriendandrequest)
router.delete('/unfriend/:friendId', requireSignin, unfriend);
router.get('/getten',findTenuser)
module.exports=router