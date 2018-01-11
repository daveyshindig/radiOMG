import './playlist_sidebar.html';
import Playlists from '../../../api/playlists/playlists_collection.js';

Template.playlistSidebar.onCreated(function(){
  var self = this;
  self.subscribe('shows');
  self.subscribe('playlistsLimited', {sort: {showDate: -1, spinPlaylistId: -1}, limit: 12});
});

Template.playlistSidebar.helpers({
  validDate: (date) => date !== undefined,
  showIsSub: (id) => id === -1,
  timeFromHMS: (str1, str2) => moment(str1, 'HH:mm:ss').format('h') + '-' + moment(str2, 'HH:mm:ss').format('hA'),
  timeFromHours: (h1, m1, h2, m2) => {
    if (m2 === 59) {
      h2 = (h2 + 1) % 24;
    }
    return moment(h1, 'HH').format(h1 > h2 ? "hA" : "h") + '-' + moment(h2, 'HH').format('hA');
  },
  dateFormat: (date) => moment(date).format('ddd. MMMM DD, YYYY'),
  getSidebarData: () => {
    var viewingPlaylistId = Session.get("playlistViewing"), playlistDates;
    if (viewingPlaylistId) {
      playlistDates = Playlists.find({ spinPlaylistId: {$ne: viewingPlaylistId } },
        {sort: {showDate: -1, spinPlaylistId: -1}, limit: 12}).fetch();
    }
    else {
      playlistDates = Playlists.find({}, {sort: {showDate: -1, spinPlaylistId: -1},
        limit: 12}).fetch();
    }
    var uniqDates =
      _.uniq(_.map(_.pluck(playlistDates, 'showDate'),
        (date) => {
          date.setSeconds(0);
          date.setMilliseconds(0);
          date.setHours(0);
          date.setMinutes(0);
          return date;
        }), true, (date) => +date);

    var a = [];
    for (var p = 0; p < uniqDates.length; p++) {
      var r = {};
      r.date = uniqDates[p];
      r.shows = _.filter(playlistDates, (obj) => +obj.showDate === +uniqDates[p]);
      a.push(r);
    }
    return a;
  }
});
