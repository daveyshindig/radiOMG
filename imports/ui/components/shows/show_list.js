import './show_list.html';
import './show_item.js';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import Shows from '../../../api/shows/shows_collection.js';
import { $ } from 'meteor/jquery';
import { getLocalTime } from '../../../startup/lib/helpers.js'

Template.showList.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('activeShows');
  });
});

Template.showList.helpers({
  active: (d) => {
    var day = FlowRouter.getQueryParam('day');
    var daze = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
      'Friday', 'Saturday'];
    var date = getLocalTime();

    var date = getLocalTime().toDate();

    // We're not routed to a particular day of the week
    if (day === undefined || $.inArray(day, daze) === -1)
      return d === daze[date.day()] ? 'active' : '';
    else return d === daze[$.inArray(day, daze)] ? 'active' : '';
  },
  daysShows: () => {
    var day = FlowRouter.getQueryParam('day');
    var daze = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
      'Friday', 'Saturday'];
    var date = getLocalTime();
    var dayNum = 0;
    if (day === undefined || $.inArray(day, daze) < 0) {
      dayNum = date.day();
    } else {
      dayNum = $.inArray(day, daze);
    }
    return Shows.find({ startDay: dayNum },
      { sort: { startHour: 1, startMinute: 1 } });
  }
});

Template.showList.events({
  'click .shows__previous-day': function (event) {
    var day = FlowRouter.getQueryParam('day');
    var daze = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
      'Friday', 'Saturday'];
    var date = getLocalTime();
    var prevDayNum = 0;
    if (day === undefined || $.inArray(day, daze) < 0)
      prevDayNum = date.day() - 1 < 0 ? 6 : date.day() - 1;
    else {
      var dayNum = $.inArray(day, daze);
      if (dayNum - 1 < 0) prevDayNum = 0;
      else prevDayNum = dayNum - 1;
    }
    FlowRouter.go(FlowRouter.getRouteName(), {}, { day: daze[prevDayNum] })
  },
  'click .shows__next-day': function (event) {
    var day = FlowRouter.getQueryParam('day');
    var daze = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
      'Friday', 'Saturday'];
    var date = getLocalTime();
    var nextDayNum = 0;
    if (day === undefined || $.inArray(day, daze) < 0)
      nextDayNum = date.day() + 1 > 6 ? 0 : date.day() + 1;
    else {
      var dayNum = $.inArray(day, daze);
      if (dayNum + 1 > 6) nextDayNum = 0;
      else nextDayNum = dayNum + 1;
    }
    FlowRouter.go(FlowRouter.getRouteName(), {}, { day: daze[nextDayNum] })
  }
});
