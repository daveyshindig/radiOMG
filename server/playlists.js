import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http';
import CryptoJS from 'crypto-js';
import '/node_modules/crypto-js/enc-base64.js';
import moment from 'moment-timezone';
import { check } from 'meteor/check';

/*
 * Server-side method to call Spinitron API to obtain playlist given a playlist ID.
 * Returns an array of objects containing track information.
 */
Meteor.methods({
  getPlaylist: function(id) {
    check(id, Number);
    var date = new Date();

    var ts = moment(date).tz("Etc/UTC");

    var params = {
      method: 'getSongs',
      station: Meteor.settings.spinitronStation,
      papiversion: Meteor.settings.spinitronPapiVersion,
      papiuser: Meteor.settings.spinitronUserId,
      timestamp: ts.format(),
      PlaylistID: id
    };

    // Sort list of pairs by key
    var keys = Object.keys(params);
    keys.sort(function(a,b) {
      return a.localeCompare(b);
    });

    var query = [];

    // Form query string
    for (var k = 0; k < keys.length; k++) {
      query.push(encodeURIComponent(keys[k]) + '=' + encodeURIComponent(params[keys[k]]));
    }
    query = query.join("&");
    var subject = "spinitron.com\n/public/spinpapi.php\n" + query;

    // Encode above variable to form signature
    var sig = CryptoJS.HmacSHA256(subject, Meteor.settings.spinitronSecret);
    sig = sig.toString(CryptoJS.enc.Base64);
    sig = encodeURIComponent(sig);

    params.signature = sig;
    var q_sig = encodeURIComponent("signature") + "=" + sig;
    query = query + "&" + q_sig;
    this.unblock();
    var res = HTTP.get("http://spinitron.com/public/spinpapi.php", {query: query});
    return JSON.parse(res.content).results;
  }
});
