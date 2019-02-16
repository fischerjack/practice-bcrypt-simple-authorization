const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

const User = require('../models/user');
const bcrypt = require('bcrypt');

const saltRounds = 10;



router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username === '' || password === ''){

    res.render('auth/signup', {
      errorMessage: 'Indicate a username and password to sign up'
    });

  } else {

    User.findOne({'username': username})
      .then(user => {
        if(user !== null){
          res.render('auth/signup', {
            errorMessage: 'That username is taken. Please choose another'
          });
        } else {

          const salt     = bcrypt.genSaltSync(saltRounds);
          const hashPass = bcrypt.hashSync(password, salt);
          
          User.create({
            username: username,
            password: hashPass
          })
          .then(() => {
            res.redirect('/');
          })
          .catch(err => {
            console.log(err);
          });
        }
      })
      .catch(err => {
        console.log(err);
      });


  }
});


module.exports = router;