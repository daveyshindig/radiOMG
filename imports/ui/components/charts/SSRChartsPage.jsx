import React, { Component } from 'react';
import Charts from '../../../api/charts/charts_collection.js';
import ChartTable from './ChartTable.jsx';
import { moment as momentUtil } from 'meteor/momentjs:moment';
import moment from 'moment-timezone';
import { Helmet } from 'react-helmet';

class SSRChartsPage extends Component {
  dateFmt(date) {
    return momentUtil(moment(date, 'Pacific/Honolulu')).format('MMMM DD, YYYY');
  }

  render() {
    var dateFmt = this.dateFmt;
    return [
      <Helmet key="metadata">
        <title>{this.props.chart.title + ' - ' +
          dateFmt(this.props.chart.chartDate) + ' - KTUH FM Honolulu' +
          ' | Radio for the People'}</title>
        <meta property="og:title"
          content={this.props.chart.title + ' - ' +
            dateFmt(this.props.chart.chartDate) + ' - KTUH FM Honolulu' +
            ' | Radio for the People'} />
        <meta property="og:description" content={
          this.props.chart.title + ' - ' +
          dateFmt(this.props.chart.chartDate)} />
        <meta name="twitter:title" content={this.props.chart.title + ' - ' +
          dateFmt(this.props.chart.chartDate) + ' - KTUH FM Honolulu' +
          ' | Radio for the People'} />
        <meta name="twitter:url" content="https://ktuh.org" />
        <meta name="twitter:description" content={
          this.props.chart.title + ' - ' +
          dateFmt(this.props.chart.chartDate)}  />
        <meta name="twitter:site" content="@ktuh_fm" />
        <meta name="twitter:image" content={
          'https://ktuh.org/img/ktuh-logo.jpg'
        } />
        <meta name="twitter:creator" content="@ktuh_fm" />
        <meta property="description" content="KTUH Radioblog" />
      </Helmet>,
      <h1 className='general__header' key='header-title'>
        {this.props.chart.title + ' - ' +
          dateFmt(this.props.chart.chartDate)}</h1>,
      <div className='chart__link' key='charts-link'>
        <a href='/charts' className='back-to'>← Back to Charts</a>
      </div>,
      <div className='playlist-list__latest' key='playlist-content'>
        {this.props.chart.tracks.length > 0 &&
          <ChartTable tracks={this.props.chart.tracks} /> || null}
      </div>
    ];
  }
}

export default (chart) => <SSRChartsPage chart={chart} />;
