import React, { Component } from 'react';
import { Form, Button, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import moment from 'moment';

import {
  fetchTravelTime,
  postEmailTime,
  putApiCall,
  setEmailData,
} from '../store/actions/reminder';

import '../styles.css'

class ReminderForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      srcLat: '',
      srcLng: '',
      destLat: '',
      destLng: '',
      time: '',
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

  calculateRemindTime = (reachTime, duration, travelData) => {
    const formatTime = moment(reachTime, 'hh:mm A').format('H:mm');
    const hrsMins = formatTime.split(':');
    const arrivalTime = new Date(new Date().setHours(hrsMins[0], hrsMins[1], 0));

    const formatDuration = duration.split(' ');
    const diffDuration = this.diffInDuration(formatDuration);

    const leaveTime = new Date(arrivalTime - diffDuration);
    const reminderTime = moment(leaveTime).format("MMM'Do, h:mm A");

    this.props.putApiCall('API Call', new Date(), 'GET');
    this.props.postEmailTime(
      leaveTime,
      this.state.email,
      travelData
    );
    this.props.setEmailData(reminderTime, travelData);
  }

  handleSubmit = async () => {
    const { srcLat, srcLng, destLat, destLng } = this.state;
    const origin = srcLat + ',' + srcLng;
    const destination = destLat + ',' + destLng;
    await this.props.fetchTravelTime(origin, destination);
    console.log("Response", this.props.remind);
  }

  render() {
    const { srcLat, srcLng, destLat, destLng,
      time, email } = this.state;
    const { travelData } = this.props.remind;
    const { destination_addresses, origin_addresses, rows } = travelData;
    let duration = '';
    if (rows && rows.length) {
      duration = rows[0].elements[0].duration.text;
    }
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
              onClick={() =>
                this.calculateRemindTime('09:08 PM', duration || '2 Mins', travelData)
              }
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
    fetchTravelTime,
    setEmailData,
    postEmailTime,
    putApiCall,
  })(ReminderForm);
