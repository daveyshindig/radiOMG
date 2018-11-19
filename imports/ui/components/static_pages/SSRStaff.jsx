import React, { Component } from 'react';
import Profiles from '../../../api/users/profiles_collection.js';
import Shows from '../../../api/shows/shows_collection.js';
import { Helmet } from 'react-helmet';

class StaffItem extends Component {
  constructor(props) {
    super(props);
  }

  usernameById(userId) {
    return Meteor.users.findOne({ _id: userId }).username;
  }

  render() {
    return (
      <div className='staff__item'>
        <h4>
          <a className="staff__item-textlink" href=
            {`/profile/${this.usernameById.bind(this, this.props.userId)}`}>
            {this.props.name}
          </a>
        </h4>
      </div>
    );
  }
}

class Staff extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.ready) {
      return [
        <Helmet key="metadata">
          <title>Staff - KTUH FM Honolulu | Radio for the People</title>
          <meta property="og:title"
            content="Staff - KTUH FM Honolulu | Radio for the People" />
          <meta property="og:description" content="KTUH Staff List" />
          <meta name="twitter:title" content=
            'Staff - KTUH FM Honolulu | Radio for the People' />
          <meta name="twitter:url" content="https://ktuh.org" />
          <meta name="twitter:description" content="KTUH Staff List" />
          <meta name="twitter:site" content="@ktuh_fm" />
          <meta name="twitter:image" content={
            'https://ktuh.org/img/ktuh-logo.jpg'
          } />
          <meta name="twitter:creator" content="@ktuh_fm" />
          <meta property="description" content="KTUH Staff List" />
        </Helmet>,
        <h2 className='general__header'>KTUH Staff</h2>,
        <div className='staff__content'>
          {this.props.djs.map((dj) => {
            return <StaffItem userId={dj.userId} name={dj.name}/>
          })}
        </div>
      ];
    }
    else return null;
  }
}

export default <Staff
  ready={true}
  djs={Profiles.find({
    userId: { $in: Shows.find().fetch().map((show) => show.userId) }
  }, { sort: { name: 1 } }).fetch() } />
