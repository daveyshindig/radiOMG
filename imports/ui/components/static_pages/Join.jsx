import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

export default class Join extends Component {
  render() {
    return [
      <Helmet key="metadata">
        <title>
          Join KTUH - KTUH FM Honolulu | Radio for the People
        </title>
        <meta property="og:title"
          content={'Join KTUH' +
            ' - KTUH FM Honolulu | Radio for the People'} />
        <meta property="og:description" content="Join KTUH" />
        <meta name="twitter:title" content=
          {'Join KTUH - KTUH FM Honolulu' +
          ' | Radio for the People'} />
        <meta name="twitter:url" content="https://ktuh.org" />
        <meta name="twitter:description" content="Join KTUH" />
        <meta name="twitter:site" content="@ktuh_fm" />
        <meta name="twitter:image" content={
          'https://ktuh.org/img/ktuh-logo.jpg'
        } />
        <meta name="twitter:creator" content="@ktuh_fm" />
        <meta property="description" content="Join KTUH" />
      </Helmet>,
      <h2 className='general__header'>Join KTUH</h2>,
      <div className='join__desc'>
        <p>
          <span className='copy__caps'>Want to</span> be a DJ? Are you a UHM
          student who wants to learn more about broadcast radio, or who just
          loves music? If so, KTUH wants you!
        </p>
        <p>
          <span className='copy__caps'>KTUH </span> is staffed almost entirely
          by UHM students, so this is your chance to be on the air and learn a
          thing or two about the behind-the-scenes magic that goes into running
          a 24-hour, 7-day-a-week radio station.
        </p>
      </div>,
      <div className='join__content'>
        <p>
          If you’d like to become a KTUH DJ, swing by our office in Hemenway 203
          (above Ba-Le) during regular business hours and fill out an
          application or download the application
          <a target="_blank" href="/files/ktuh_personnel_application_form.pdf">
            here
          </a>.
        </p>
        <p>
          Due to the number of students interested in being on the air, it may
          take three months to a year before an applicant is called in for
          training, depending on the length of the waiting list and the amount
          of station turnover.
        </p>
        <p>
          For more information, please contact our programming department at
          (808) 956-5288 or <a href=
          'mailto:&#112;&#100;&#64;&#107;&#116;&#117;&#104;&#46;&#111;&#114;&#103;'>
            &#112;&#100;&#64;&#107;&#116;&#117;&#104;&#46;&#111;&#114;&#103;
          </a>.
        </p>
        <p>
          If you are not a UHM student, please contact the programming
          department to ask about our limited number of community timeslots.
        </p>
        <p>
          Just want to help out? If you’re not interested in being on air but
          still want to help out at the station, contact the programming
          department at (808) 956-5288 or <a href=
          'mailto:&#112;&#100;&#64;&#107;&#116;&#117;&#104;&#46;&#111;&#114;&#103;'>
            &#112;&#100;&#64;&#107;&#116;&#117;&#104;&#46;&#111;&#114;&#103;
          </a>
          for information on ways you can get involved off air.
        </p>
      </div>
    ];
  }
}
