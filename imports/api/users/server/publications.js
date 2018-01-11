import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Profiles from '../profiles_collection.js';
import Posts from '../../posts/posts_collection.js';
import { _ } from 'underscore';

Meteor.publish('userData', function(username) {
  check(username, String);
  return Meteor.users.find({username: username},
                           {fields: {'username': 1, '_id': 1}});
});

Meteor.publish('userById', function(id) {
  check(id, String);
  return Meteor.users.find({_id: id});
});

Meteor.publish('userByDisplayName', function(name) {
  check(name, String);
  return Meteor.users.find({ _id: Profiles.findOne({ name: name }).userId },
                           { fields: { 'username': 1, '_id': 1 } });
});

Meteor.publish('bannedProfiles', function() {
  return Profiles.find({banned: true});
});

Meteor.publish('profileData', function(userId) {
  check(userId, String);
  return Profiles.find({ userId: userId });
});

Meteor.publish('profileDataByUsername', function(username) {
  check(username, String);
  var user = Meteor.users.findOne({ username: username });
  return Profiles.find({ userId: user._id });
});

Meteor.publish('latestSevenWriters', () => {
  var featured = Posts.find({ featured: true, approved: true },
              { sort: { submitted: -1 }, limit: 1 }).fetch();
  var nonFeatured = Posts.find({ featured: false, approved: true },
                { sort: { submitted: -1 }, limit: 6 }).fetch();
  var posts = nonFeatured.concat(featured);
  var ids = _.uniq(_.map(posts, (p, i) => p.userId));
  return Profiles.find({ userId: { $in: ids } });
});

Meteor.publish('latestSevenWritersUsernames', () => {
  var featured = Posts.find({ featured: true, approved: true },
              { sort: { submitted: -1 }, limit: 1 }).fetch();
  var nonFeatured = Posts.find({ featured: false, approved: true },
                { sort: { submitted: -1 }, limit: 6 }).fetch();
  var posts = nonFeatured.concat(featured);
  var ids = _.map(posts, (p, i) => p.userId);
  return Meteor.users.find({ _id: { $in: ids } }, { fields: 'username' });
});

Meteor.publish('profileNamesById', (ids) => {
  return Profiles.find({ userId: { $in: ids } });
});

Meteor.publish('djProfiles', () => {
  var djs = Meteor.users.find({ roles: 'dj' }).fetch();
  var userIds = _.map(djs, (p, i) => p._id);
  return Profiles.find({ userId: { $in: userIds} });
});

Meteor.publish('djs', () => Meteor.users.find({ roles: 'dj' }));
