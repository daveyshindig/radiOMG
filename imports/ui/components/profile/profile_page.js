import './profile_page.html';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import Posts from '../../../api/posts/posts_collection.js';
import Profiles from '../../../api/users/profiles_collection.js';
import Shows from '../../../api/shows/shows_collection.js';
import { Bert } from 'meteor/themeteorchef:bert';
import { FlowRouter } from 'meteor/kadira:flow-router';
import '../application/layout.js';

Template.profilePage.onCreated(function() {
  var self = this;

  self.autorun(function() {
    var username = FlowRouter.getParam('username');

    self.subscribe('userData', username, {
      onReady: function() {
        var user = Meteor.users.findOne({ username: username });
        if (user !== undefined) {
          self.subscribe('profileData', user._id);
          self.subscribe('showByUserId', user._id);
          self.subscribe('postsByUser', username);
        }
      }
    });
  });
});

Template.profilePage.helpers({
  negB1orB2: (b1,b2) => (!b1 || b2),
  negB1andB2: (b1,b2) => (!b1 && b2),
  isAdmin: () =>
    Meteor.user() !== null && Meteor.user().hasRole('admin'),
  isBanned: () => {
    var user = Meteor.users.findOne({
      username: FlowRouter.getParam('username' )
    });
    var profile = Profiles.findOne({ userId: user._id });
    return profile.banned;
  },
  profile: function() {
    var username = FlowRouter.getParam('username');
    var user = Meteor.users.findOne({ username: username });
    var profile = Profiles.findOne({ userId: user._id });

    if (profile !== undefined) {
      return profile;
    } else return false;
  },
  social: function() {
    var username = FlowRouter.getParam('username');
    var user = Meteor.users.findOne({ username: username });
    var profile = Profiles.findOne({ userId: user._id });

    if (profile !== undefined) {
      return profile.website || profile.twitter || profile.facebook ||
             profile.snapchat || profile.soundcloud;
    } else return false;
  },
  posts: function() {
    var posts = Posts.find({}, { sort: { submitted: -1 } });

    return posts.count() > 0 && posts;
  },
  ownProfile: function() {
    var username = FlowRouter.getParam('username');
    var user = Meteor.users.findOne({ username: username });
    var profile = Profiles.findOne({ userId: user._id });

    return Meteor.userId() && profile.userId === Meteor.userId();
  },
  show: function() {
    var user = Meteor.users.findOne({
      username: FlowRouter.getParam('username')
    });
    return Shows.findOne({ userId: user._id });
  }
});

Template.profilePage.events({
  'click #profile__ban-user': (event) => {
    if (Meteor.user().hasRole('admin')) {
      var username = FlowRouter.getParam('username');
      var user = Meteor.users.findOne({ username: username });
      var profile = Profiles.findOne({ userId: user._id });
      Profiles.update(profile._id, { $set: { banned: true } });
      Bert.alert('User @' + username + ' banned.', 'default');
    }
  },
  'click #profile__unban-user': (event) => {
    if (Meteor.user().hasRole('admin')) {
      var username = FlowRouter.getParam('username');
      var user = Meteor.users.findOne({ username: username });
      var profile = Profiles.findOne({ userId: user._id });
      Profiles.update(profile._id, { $set: { banned: false } });
      Bert.alert('User @' + username + '\'s ban lifted.', 'default');
    }
  }
});
