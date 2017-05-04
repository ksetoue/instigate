'use strict';

const jwt = require('jsonwebtoken');
const UserRouter = require('express').Router();
const formidable = require('formidable');

const ImageService = require('../../lib/image.js');

const User = require('../../model/user.js');
const Category = require('../../model/category.js');
const JWTValidations = require('../../middleware').JWTValidations;
const populateFields = 'interests pendent_mentors pendent_pupils mentors pupils followers following';


function register(req, res){

  let status = 201;

  ImageService.insertImage(req).then(function(image){
    let name = req.body.name;
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let country = req.body.country;
    let newUser = new User({
      name,
      username,
      email,
      password,
      country,
      image
    })
    newUser.save(function(err){
      if(err){
        status = 500;
        if(err.code == 11000){
          status = 409;
        }
        res.status(status).json({message: err});
      }else{
        res.status(status).json({message: 'User Registered'});
      }
    })
  }).catch(function(error){
    console.log(error);
  })
}

function unregister(req, res){
  if(req.user.username == req.body.username){
    return User.remove({
      username: req.user.username
    }).then(function(){
      return res.status(204).end();
    }).catch(function(){
      return res.status(500).json({message: 'Database operation error'});
    })
  }
  return res.status(401).json({message: 'Unauthorized request.'});
}

function login(req, res){
  User.findOne({
    username: req.body.username,
    password: req.body.password
  }).populate(populateFields).select('-password').exec().then(function(user){

    if(user == null){
      return res.status(404).json({ message: 'User or password invalid'});
    }
    let response = {};
    let token = jwt.sign(user, JWTValidations.salt, {
      expiresIn: '1d'
    });

    response.message = 'User Authenticated.'
    response.user = user;
    response.token = token;
    res.status(200).json(response);
  }).catch(function(status, error){
    res.status(500).json({ message: 'Database Query Error.' });
  });

}

function listUsers(req, res){
  User.find({}).populate(populateFields).select('-password').exec().then(function(users){
    res.status(200).json({result: users})
  }).catch(function(error){
    res.status(500).json({message: 'Database error.'})
  })
}

function listMentors(req, res){
  User.find({is_mentor:true}).populate(populateFields).select('-password').exec().then(function(users){
    res.status(200).json({result: users})
  }).catch(function(error){
    res.status(500).json({message: 'Database error.'})
  })
}

function showProfile(req, res){
  User.findOne({username: req.user.username}).populate(populateFields).select('-password').exec().then(function(users){
    res.status(200).json({result: users})
  }).catch(function(error){
    res.status(500).json({message: 'Database error.'})
  })
}

function showUser(req, res){
  User.findOne({username: req.params.username}).populate(populateFields).select('-password').exec().then(function(users){
    res.status(200).json({result: users})
  }).catch(function(error){
    res.status(500).json({message: 'Database error.'})
  })
}

function addInterest(req, res){
  let name = req.body.name;
  Category.findOne({name}).then(function(category){
    if(category == null){
      return res.status(404).json({message: 'Interest category not found'})
    }
    let user = req.user;
    user.interests.push(category._id);
    user.save();
    res.status(201).json({message: 'Added Category in interest list'})
  }).catch(function(error){
    res.status(500).json({message: 'Database error'})
  })
}

function follow(req, res){
  let username = req.body.username;
  User.findOne({username}).then(function(userToFollow){
    if(userToFollow == null){
      return res.status(404).json({message: 'User to follow not found'})
    }
    let user = req.user;
    user.following.push(userToFollow._id);
    userToFollow.followers.push(user._id);
    user.save();
    userToFollow.save();
    res.status(201).json({message: `Following ${username}`})
  }).catch(function(error){
    res.status(500).json({message: 'Database error'})
  })
}

function unfollow(req, res){
  let username = req.body.username;
  User.findOne({username}).then(function(userToUnfollow){
    if(userToUnfollow == null){
      return res.status(404).json({message: 'User to unfollow not found'})
    }
    let user = req.user;

    user.following.splice(user.following.indexOf(userToUnfollow._id), 1)
    userToUnfollow.followers.splice(userToUnfollow.followers.indexOf(user._id), 1)

    user.save();
    userToUnfollow.save();

    res.status(201).json({message: `Not Following ${username}`})
  }).catch(function(error){
    res.status(500).json({message: 'Database error'})
  })
}

function becomeMentor(req, res){
  let user = req.user;
  user.is_mentor = true;
  user.save().then(function(error){
    res.status(200).json({message: `${user.name} is a mentor`});
  }).catch(function(error){
    res.status(500).json({message: 'Database error'})
  })
}

function askMentoring(req, res){
  let user = req.user;
  let username = req.body.username;
  User.find({username, is_mentor: true}).then(function(mentor){
    if(mentor == null){
      return res.status(404).json({message: 'can\'t find mentor'});
    }
    mentor.pendent_pupils.push(user._id);
    user.pendent_mentors.push(mentor._id);

    mentor.save();
    user.save();

    res.status(201).json({message: 'mentoring request sent'});
  })
  .catch(function(error){
    res.status(500).json({message: 'Database error'})
  })
}

function acceptPupil(req, res){
  let user = req.user;
  let username = req.body.username;
  User.find({username}).then(function(pupil){
    if(pupil == null){
      return res.status(404).json({message: 'can\'t find pupil user'});
    }
    let pupilIndex = user.pendent_pupils.indexOf(pupil._id);
    let mentorIndex = pupil.pendent_mentors.indexOf(user._id);
    if(pupilIndex < 0 || mentorIndex < 0){
      return res.status(404).json({message: 'can\'t find pupil mentor relationship'});
    }
    user.pendent_pupils.splice(pupilIndex, 1);
    pupil.pendent_mentors.splice(mentorIndex, 1);

    user.pupils.push(pupil._id);
    pupil.mentors.push(user._id);

    user.save();
    pupil.save();

    res.status(201).json({message: 'mentoring request accepted'});
  })
  .catch(function(error){
    res.status(500).json({message: 'Database error'})
  })
}
function rejectPupil(req, res){
  let user = req.user;
  let username = req.body.username;
  User.find({username}).then(function(pupil){
    if(pupil == null){
      return res.status(404).json({message: 'can\'t find pupil user'});
    }
    let pupilIndex = user.pendent_pupils.indexOf(pupil._id);
    let mentorIndex = pupil.pendent_mentors.indexOf(user._id);
    if(pupilIndex < 0 || mentorIndex < 0){
      return res.status(404).json({message: 'can\'t find pupil mentor relationship'});
    }
    user.pendent_pupils.splice(pupilIndex, 1);
    pupil.pendent_mentors.splice(mentorIndex, 1);

    user.save();
    pupil.save();

    res.status(201).json({message: 'mentoring request accepted'});
  })
  .catch(function(error){
    res.status(500).json({message: 'Database error'})
  })
}

UserRouter.get('/', JWTValidations.AuthMiddleware, listUsers);
UserRouter.post('/', register)
UserRouter.delete('/', JWTValidations.AuthMiddleware , unregister)

UserRouter.get('/profile', JWTValidations.AuthMiddleware, showProfile);
UserRouter.get('/profile/:username', JWTValidations.AuthMiddleware, showUser);

UserRouter.post('/interest', JWTValidations.AuthMiddleware, addInterest);

UserRouter.post('/follow', JWTValidations.AuthMiddleware, follow);
UserRouter.post('/unfollow', JWTValidations.AuthMiddleware, unfollow);


UserRouter.get('/mentor', JWTValidations.AuthMiddleware, listMentors)
UserRouter.post('/mentor', JWTValidations.AuthMiddleware, becomeMentor)
UserRouter.post('/mentor/ask', JWTValidations.AuthMiddleware, askMentoring)
UserRouter.post('/mentor/accept', JWTValidations.AuthMiddleware, acceptPupil)
UserRouter.post('/mentor/reject', JWTValidations.AuthMiddleware, rejectPupil)

UserRouter.post('/login', login)

module.exports = UserRouter;
