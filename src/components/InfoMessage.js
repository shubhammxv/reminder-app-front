import React, { Component } from 'react';
import { Header, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';

import '../styles.css'

class InfoMessage extends Component {

  render() {
    const { time } = this.props.remind.emailData;
    return (
      <Header
        className="info-message"
        textAlign='center'
        block
      >
        <Icon
          name={time ? 'bell outline': 'taxi'}
        />
        <Header.Content>
          { time
            ? `Reminder through Email set for ${time}!`
            : "It's time to leave!"
          }
        </Header.Content>
      </Header>
    )
  }
}

const mapStateToProps = ({ remind }) => ({ remind });

export default connect(mapStateToProps, null)(InfoMessage);
