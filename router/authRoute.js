const express = require('express');
const { SignUp, login } = require('../controller/usercontroller');
const router=express.Router();

router.post('/signup',SignUp)
router.post('/login',login)

module.exports=router