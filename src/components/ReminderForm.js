import React, { Component } from 'react';
import { Form, Button, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import moment from 'moment';

import {
  getServerStatus,
  fetchTravelTime,
  postEmailTime,
  putApiCall,
  setEmailData,
  setInfoMessage,
} from '../store/actions/reminder';

import '../styles.css'

class ReminderForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      srcLat: 12.927880,
      srcLng: 77.627600,
      destLat: 13.035542,
      destLng:  77.597100,
      time: '8:00 PM',
      email: '',
    }
  }

  handleInputChange = (key, value) => {
    this.setState({
      [key]: value
    })
  }

  diffInDuration = (timeData) => {
    if (timeData.length === 2) {
      return timeData[0] * 60 * 1000;
    } else if (timeData.length === 4) {
      return timeData[0] * 60 * 60 * 1000
        + timeData[2] * 60 * 1000;
    } else {
      return 0;
    }
  }

  resetInfoMessage = () => {
    this.props.setInfoMessage(
      'info',
      `It's time to leave!`,
      'taxi'
    )
  }

  resetState = () => {
    this.setState({
      srcLat: '',
      srcLng: '',
      destLat: '',
      destLng:  '',
      time: '',
      email: '',
    })
  }

  calculateRemindTime = async (reachTime) => {
    const { travelData } = this.props.remind;
    const { destination_addresses, origin_addresses, rows } = travelData;
    let duration = 'O Mins';
    if (rows && rows.length) {
      duration = rows[0].elements[0].duration.text;
    }

    const formatTime = moment(reachTime, 'hh:mm A').format('H:mm');
    const hrsMins = formatTime.split(':');
    const arrivalTime = new Date(new Date().setHours(hrsMins[0], hrsMins[1], 0));

    const formatDuration = duration.split(' ');
    const diffDuration = this.diffInDuration(formatDuration);

    const leaveTime = new Date(arrivalTime - diffDuration);
    const reminderTime = moment(leaveTime).format("MMM'Do, h:mm A");

    if (leaveTime < new Date()) {
      this.props.setInfoMessage(
        'warning',
        `Leaving time has already passed. You needed to leave at ${reminderTime}`,
        'warning sign'
      )
      this.setState({
        destLat: '',
        destLng:  '',
      })
      setTimeout(this.resetInfoMessage, 3000);
      return;
    }

    try {
      await this.props.postEmailTime(
        leaveTime,
        this.state.email,
        travelData
      );
      this.props.setEmailData(reminderTime, travelData);
      this.props.setInfoMessage(
        'success',
        `Email Reminder set for ${reminderTime}`,
        'info circle'
      )
      this.resetState();
      setTimeout(this.resetInfoMessage, 3000);

    } catch (err) {
      this.props.setInfoMessage(
        'error',
        `Error while Posting Email Reminder`,
        'warning circle'
      )
      console.log("Error while Posting Email Reminder", err);
      setTimeout(this.resetInfoMessage, 3000);
      return;
    }
  }

  handleSubmit = async () => {
    try {
      await this.props.getServerStatus();
    } catch (err) {
      this.props.setInfoMessage(
        'error',
        `Error while getting server status`,
        'info circle'
      )
      console.log("Error while getting server status", err);
      setTimeout(this.resetInfoMessage, 3000);
      return;
    }

    const { srcLat, srcLng, destLat, destLng, time } = this.state;
    const origin = srcLat + ',' + srcLng;
    const destination = destLat + ',' + destLng;
    try {
      await this.props.fetchTravelTime(origin, destination);
      console.log("Fetched Travel Time", this.props.remind);
      this.calculateRemindTime(time);
    } catch (err) {
      this.props.setInfoMessage(
        'error',
        `Error while calling matrix API`,
        'warning circle'
      )
      console.log("Error while calling matrix API", err);
      setTimeout(this.resetInfoMessage, 3000);
      return;
    }
  }

  render() {
    const { srcLat, srcLng, destLat, destLng,
      time, email } = this.state;

    const isDisabled = !(srcLat && srcLng && destLat && destLng && time && email);
    return (
      <Form>
        <Segment>
          <Form.Group inline>
            <label>Source</label>
            <Form.Input
              type='number'
              style={{ marginLeft: '28px' }}
              placeholder= "00.0000"
              value={srcLat}
              onChange={(e, { value }) =>
                this.handleInputChange('srcLat', value)
              }
            />
            <Form.Input
              type='number'
              placeholder= "00.0000"
              value={srcLng}
              onChange={(e, { value }) =>
                this.handleInputChange('srcLng', value)
              }
            />
          </Form.Group>
          <Form.Group inline>
            <label>Destination</label>
            <Form.Input
              type='number'
              placeholder= "00.0000"
              value={destLat}
              onChange={(e, { value }) =>
                this.handleInputChange('destLat', value)
              }
            />
            <Form.Input
              type='number'
              placeholder= "00.0000"
              value={destLng}
              onChange={(e, { value }) =>
                this.handleInputChange('destLng', value)
              }
            />
          </Form.Group>
          <Form.Group inline>
            <label>Time</label>
            <Form.Input
              style={{ marginLeft: '39px' }}
              placeholder= {`E.g. ${moment().format('hh:mm A')}`}
              value={time}
              onChange={(e, { value }) =>
                this.handleInputChange('time', value)
              }
            />
          </Form.Group>
          <Form.Group inline>
            <label>Email</label>
            <Form.Input
              type='email'
              style={{ marginLeft: '35px', width: '368px' }}
              placeholder= "E.g. dummy@gmail.com"
              value={email}
              onChange={(e, { value }) =>
                this.handleInputChange('email', value)
              }
            />
          </Form.Group>
          <div className="submit-btn">
            <Button
              type='submit'
              color='twitter'
              disabled={isDisabled}
              onClick={this.handleSubmit}
            >Remind Me
            </Button>
          </div>
        </Segment>
      </Form>
    )
  }
}

const mapStateToProps = ({ remind }) => ({ remind });

export default connect(
  mapStateToProps,
  {
    getServerStatus,
    fetchTravelTime,
    setEmailData,
    postEmailTime,
    putApiCall,
    setInfoMessage,
  })(ReminderForm);
