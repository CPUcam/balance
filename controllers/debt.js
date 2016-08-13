const Debt = require('../models/Debt');
const Group = require('../models/Group');
const User = require('../models/User');
const Search = require('../models/Search');
//const Stream = require('../models/Stream');

var nameTest = '';
var emailTest = '';
var picture = '';

var streamName = '';
var streamAmount = 0;
var streamMessage = '';

/*
* GET /debt
* Debt page
*/
exports.getDebt = (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  res.render('account/debt', {
    title: 'Debt'
  });
};

/**
* GET /group
* Group page
*/
exports.getGroup = (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  res.render('account/group', {
    title: 'Group'
  });
};

/*
* GET /stream
* Debt page
*/
exports.getStream = (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  res.render('account/stream', {
    title: 'Stream'
  });
};

/**
* POST /group
* Create new group
**/
exports.postNewGroup = (req, res) => {

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }

  const group = new Group({
    name: req.body.groupName,
    one: req.body.one,
    two: req.body.two,
    three: req.body.three,
    four: req.body.four
  });

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    if (user.groupLimit == 1) {
      req.flash('errors', { msg: 'grouplimit reached' });y
    }
    user.groupLimit = 1;
    user.save((err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: 'grouplimit' });

    });
  });

  Group.findOne({ name: req.body.groupName }, (err, existingUser) => {
    if (existingUser) {
      req.flash('errors', { msg: 'Group with that name already exists.' });
      return res.redirect('/group');
    }
    group.save((err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Success! Balance Group successfully created!' });
      res.redirect(req.session.returnTo || '/');
      });
    });
};

/*
* POST friend search
* search for friend by email
*/
exports.postSearchFriend = (req, res) => {
  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/debt');
  }

  User.findOne({ email: req.body.searchFriend }, (err, existingUser) => {
    if (!existingUser) {
      req.flash('errors', { msg: 'No User with name or email found.' });
      return res.redirect('/debt');
    }

    const search = new Search({
      name: existingUser.name,
      email: existingUser.email,
      picture: existingUser.profile.picture
    });

    nameTest = existingUser.name;
    emailTest = existingUser.email;
    picture = existingUser.profile.picture;

    //
    // search.save((err) => {
    //   if (err) { return next(err); }
    //   //req.flash('success', { msg: 'user saved in search' });
    //   //res.redirect('/debt');
    //   console.log('saved');
    // })

    req.flash('success', { msg: 'Success! User found!' });
    res.render('account/debt', { search: search });
  });
};

/*
* POST addFriend
* add friend to friend list
*/
exports.postAddFriend = (req, res) => {
  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/debt');
  }

  for (var i = 0; i < req.user.friendsList.length; i++) {
    if (req.user.friendsList[i].name == nameTest) {
        req.flash('errors', { msg: 'Friend already added!' });
        return res.redirect('/debt');
    }
  }

  User.findOne({ name: nameTest }, (err, friend) => {
    if (err) { return next(err); }
    friend.friendsList.addToSet({ name: req.user.name, email: req.user.email });
    friend.save((err) => {
      if (err) { return next(err); }
    });
  });

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.friendsList.addToSet({ name: nameTest, email: emailTest });
    console.log(nameTest);
    user.save((err) => {
      if (err) { return next(err); }
    });
    res.redirect('/debt');
  });
};

/*
* POST addDebt
* add debt between user and friend
*/
exports.postAddDebt = (req, res) => {
  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/debt');
  }

  console.log(req.body.friend);

  streamName = req.body.friend;
  streamAmount = req.body.amount;
  streamMessage = req.body.message;

  console.log(parseFloat(streamAmount));
  if (!(!isNaN(parseFloat(streamAmount)) && isFinite(streamAmount)) || (parseFloat(streamAmount) < 0)) {
    console.log(parseFloat(streamAmount));
    req.flash('errors', { msg: 'Please enter a valid, non negative amount.' });
    return res.redirect('/debt');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }

    User.findOne({ name: req.body.friend }, (err, friend) => {
      if (!friend) {
        req.flash('errors', { msg: 'Couldn\'t find friend!'  });
      }
      for (var i = 0; i < friend.friendsList.length; i++) {
        if (friend.friendsList[i].name == user.name) {
          var f = friend.friendsList[i].debt + Number(streamAmount);
          friend.friendsList[i].debt += Number(streamAmount);
          friend.update({'friendsList.name': user.name },  { $set: { debt: f }});
          console.log(f);
          console.log(typeof streamAmount);
        }
        else { console.log('fail1'); }
      }
      for (var i = 0; i < user.friendsList.length; i++) {
        if (user.friendsList[i].name == friend.name) {
          user.friendsList[i].debt -= streamAmount;
          //user.update({'friendsList.name': user.name})
          //console.log(t);
        }
        else { console.log('fail2'); }
      }
      user.stream.addToSet({ friend: streamName, amount: streamAmount, message: streamMessage });
      friend.save((err) => {});
      user.save((err) => {
        //if (err) { return next(err); }
      });
    });



    res.redirect('/debt');
  });
};
