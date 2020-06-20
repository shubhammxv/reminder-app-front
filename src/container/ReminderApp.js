import React, { Component, Fragment } from 'react';

import {
  ApiCalls,
  ReminderForm,
  InfoMessage,
} from '../components';


class ReminderApp extends Component {
  render() {
    return (
      <Fragment>
        <InfoMessage />
        <ReminderForm />
        <ApiCalls />
      </Fragment>
    )
  }
}

export default ReminderApp;
