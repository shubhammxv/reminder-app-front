import React, { Component } from 'react';
import { Message, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';

import '../styles.css'

class InfoMessage extends Component {

  render() {
    const { infoData, emailData } = this.props.remind;
    const { info, message, icon } = infoData;
    return (
      <Message
        className="info-message"
        icon={icon}
        info={info === 'info'}
        error={info === 'error'}
        warning={info === 'warning'}
        header={message}
        style={{ textAlign: 'center' }}
      />
    )
  }
}

const mapStateToProps = ({ remind }) => ({ remind });

export default connect(mapStateToProps, null)(InfoMessage);
