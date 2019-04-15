import React, { Component } from 'react';
import { scorpius } from 'meteor/scorpiusjs:core';

export default class ScorpiusImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      ready: true
    };
    this.uploadHelper = this.uploadHelper.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setTrue = this.setTrue.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  setTrue(url) {
    this.setState({ ready: true, value: url });
    this.props.onChange(url);
  }

  uploadHelper(files) {
    this.setState({ ready: false });
    var set = this.setTrue;
    if (scorpius.filesystem.isUploading()) return;
    var upload = scorpius.filesystem.upload({
      fileList: files,
      name: files[0].name,
      uploader: 'image-attribute'
    });
    Tracker.autorun(function(comp) {
      console.log(upload.progress());
      if (upload.ready()) {
        if (upload.error) {
          Bert.alert('There was an error uploading the image.');
        }
        if (upload.progress() === 100) {
          set(upload.url);
          comp.stop();
        }
      }
    });
  }

  handleChange(event) {
    this.uploadHelper(event.target.files);
  }

  render() {
    return (
      <div>
        <p>{this.props.label}</p>
        <div><img id="urlImage" src={this.state.value} /></div>
        <input type="file"
          onChange={(event, key, value) => this.handleChange(event)} />
        <input type="text" disabled={true} value={this.state.value} />
      </div>
    );
  }
}
