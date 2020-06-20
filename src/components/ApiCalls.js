import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import moment from 'moment'
import '../styles.css'

class ApiCalls extends Component {

  renderApiCalls = (apiCalls) => {
    return (
      apiCalls.map(apiCall => {
        const { callTime, method } = apiCall;
        const formatTime = moment(callTime).format('hh:mm:ss A');
        return (
          <div
            key={callTime * Math.random()}
            className='api-call'
          >
            <div>
              {'[ ' + formatTime + ' ]'}
            </div>
            <div>
              {method === 'GET'
                ? 'Requested Distance matrix API for Duration'
                : 'Posted Reminder Time for Email'
              }
            </div>
          </div>
        )
      })
    )
  }

  render() {
    const { remind } = this.props;
    const { apiCalls } = remind;
    return (
      apiCalls.length > 0 ?
        <Segment className='api-calls-container'>
          {this.renderApiCalls(apiCalls)}
        </Segment> : null
    )
  }
}

const mapStateToProps = ({ remind }) => ({ remind });

export default connect(mapStateToProps, null)(ApiCalls);
