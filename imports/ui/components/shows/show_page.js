import './show_page.html';
import Shows from '../../../api/shows/shows_collection.js';
import Playlists from '../../../api/playlists/playlists_collection.js';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { moment as momentUtil } from 'meteor/momentjs:moment';
import moment from 'moment-timezone';

Template.showPage.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var slug = FlowRouter.getParam('slug');
    self.subscribe('singleShow', slug, {
      onReady: function() {
        var show = Shows.findOne({ slug: slug });
        if (show) {
          Session.set('documentTitle', show.showName);
          self.subscribe('comments', show._id);
          self.subscribe('userById', show.userId);
          self.subscribe('showPlaylists', show.showId, {
            onReady: function() {
              var latest = Playlists.findOne({ showId: show.showId },
                { sort: { showDate: -1 } });

              if (latest !== undefined) {
                var parsedId = parseInt(latest.spinPlaylistId);
                if (parsedId < 10000) {
                  Meteor.call('getPlaylistOrInfo',
                    parsedId, true, function(error, result) {
                      if (!error && result)
                        Session.set('currentPlaylist',
                          JSON.parse(result.content).results);
                    });
                }
                else {
                  Meteor.call('getPlaylistSpins',
                    parsedId, function(error, result) {
                      if (!error && result)
                        Session.set('currentPlaylist', result.data.items);
                    });
                }
              }
            }
          });
        }
      }
    });
  });
});

Template.showPage.helpers({
  show: () =>  Shows.findOne({ slug: FlowRouter.getParam('slug') }),
  lessThanTen: (n) => Math.abs(n) < 10,
  time: (t) => momentUtil(t).format('ddd. MMM. D, YYYY'),
  playlists: () => Playlists.find({
    showId: Shows.findOne({ slug: FlowRouter.getParam('slug') }).showId
  }, { sort: { showDate: -1 } }),
  latestPlaylist: () => Playlists.findOne({
    showId: Shows.findOne({ slug: FlowRouter.getParam('slug') }).showId
  }, { sort: { showDate: -1 } }),
  pastPlaylists: () => Playlists.find({}, { sort: { showDate: -1 }, skip: 1 }),
  playlistsByYear: () => {
    var playlistDates = Playlists.find({
      showId: Shows.findOne({ slug: FlowRouter.getParam('slug') }).showId
    }, { sort: { showDate: -1 }, skip: 1 }).fetch();
    var uniqDates = _.uniq(_.map(_.pluck(playlistDates, 'showDate'),
      (obj) => obj.getFullYear()), true, (date) => +date);
    var a = [];
    for (var p = 0; p < uniqDates.length; p++) {
      var r = {};
      r.year = uniqDates[p];
      r.shows = _.filter(playlistDates,
        (obj) => obj.showDate.getFullYear() === uniqDates[p]);
      a.push(r);
    }
    return a;
  },
  slug: () => FlowRouter.getParam('slug'),
  profileUrl: function(id) {
    var user = Meteor.users.findOne({ _id: id });
    return '/profile/' + user.username;
  },
  isPlaying: (mp3) => Session.get('nowLoaded') == mp3 &&
                      Session.get('paused') === false,
  day: function(num) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
      'Friday', 'Saturday'];
    return days[num];
  },
  timeBeautify: (startHour, startMinute, endHour, endMinute) => {
    if (startMinute === 1) {
      startMinute--;
    }
    if (endMinute === 59) {
      endHour = (endHour + 1) % 24;
      endMinute = 0;
    }
    var ap = startHour > endHour;
    if (ap) ap = 'h:mmA';
    else ap = 'h:mm';
    return momentUtil(moment(momentUtil(startHour + ':' + startMinute, 'HH:mm'))
      .tz('Pacific/Honolulu')).format(ap) +
      '-' + momentUtil(moment(momentUtil(endHour + ':' + endMinute, 'HH:mm'),
      'Pacific/Honolulu')).format('h:mmA');
  },
  timeBeautify2: (time) => momentUtil(moment(momentUtil(time),
    'Pacific/Honolulu')).format('h:mma'),
  genreString: (genres) => genres.join(', '),
  actualPlaylist: () => {
    var retval = Session.get('currentPlaylist');
    retval.sort(function(a,b) {
      if (a.start > b.start) {
        return 1;
      }
      else if (a.start < b.start) {
        return -1;
      }
      else return 0;
    });
    return retval;
  }
});

Template.showPage.events({
  'click .show__play-btn': function (event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    var mp3Url = $(event.currentTarget).data('path');
    var nowLoaded = Session.get('nowLoaded');

    if (nowLoaded != mp3Url) {
      var show = Shows.findOne({ slug: FlowRouter.getParam('slug') });
      $('.mejs__time-slider').css('visibility', 'visible');
      $('.mejs__broadcast').css('visibility', 'hidden');
      player.setSrc(mp3Url);
      var message = 'Now playing the latest episode of ' + show.showName;
      Session.set('defaultLoaded', false);
      Session.set('nowLoaded', mp3Url);
      if (!Session.get('playedStream')) Session.set('playedStream', true);
      Bert.alert(message, 'default', 'growl-top-right', 'fa-music');
    }

    if (player.paused) {
      player.play();
    }
    else if (!player.paused) {
      player.pause();
    }
  },
  'change select': function(event) {
    FlowRouter.go('/playlists/' + $(event.target).val());
  },
  'click .goto-dj-profile': function() {
    var id = Shows.findOne({ slug: FlowRouter.getParam('slug') }).userId;
    var user = Meteor.users.findOne({ _id: id });
    FlowRouter.go('/profile/' + user.username);
  }
});
