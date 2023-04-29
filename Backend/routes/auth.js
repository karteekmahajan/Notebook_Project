const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
var fetchuser = require('./middleware/fetchuser')

const JWT_SECRET = 'Good Boy';


// Route-1:  create a user using: POST "/api/auth/createuser". doesnt require authenticaton
router.post('/createuser', [
  body('name', 'enter a valid name').isLength({ min: 3 }),
  body('email', 'enter a valid email').isEmail(),
  body('password', 'password must be 5 character').isLength({ min: 5 }),

], async (req, res) => {
  let success = false;
  //  If there are errors, return bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() })
  }
  //  check wheteher user with this email exists already
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return req.status(400).json({ success, error: "sorry a user with this email is already exists" })
    }

  const salt = await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(req.body.password, salt)
    // create a new user
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
    })
    const data = {
      user:{
        id:user.id
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET);

    // res.json( user )
    success = true;
    res.json( {success, authToken} )
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }

})

// Route-2:  Authenticate a user login using POST "/api/auth/login". No login is required

router.post('/login', [
  body('email', 'enter a valid email').isEmail(),
  body('password', 'password can not be blank').exists(),

], async (req, res) => {

  let success = false;

//  If there are errors, return bad request and the errors
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() })
}

const{email, password} = req.body;
try{
   let user = await User.findOne({email});
  if(!user){
    success = false;
    return res.status(400).json({error: "please try to login with correct credentials "});
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if(!passwordCompare){
    success = false;
    return res.status(400).json({success, error: "please try to login with correct credentials "});
  }
  const data = {
    user:{
      id:user.id
    }
  }
  const authToken = jwt.sign(data, JWT_SECRET);
  success = true;
  res.json({success, authToken})
}
catch (error) {
  console.error(error.message);
  res.status(500).send("Internal server error");
}

})

// Route-3: get a user detail using POST "/api/auth/getuser".login is required
router.post('/getuser', fetchuser,  async (req, res) => {
try {
  userId = req.user.id;
  const user = await User.findById(userId).select("-password")
  res.send(user);
} catch (error) {
  console.error(error.message);
  res.status(500).send("Internal server error");
}

})
module.exports = router