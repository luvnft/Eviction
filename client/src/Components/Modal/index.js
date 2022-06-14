import React from 'react';
import PropTypes from 'prop-types';
import { Circles } from 'react-loader-spinner';
import { Button } from 'semantic-ui-react';
import config from './config.js';
import util from './util';
import './style.css';

const Modal = ({ content, setModalStatus }) => {
  return (
    <div id='modal'>
      <div id='modal-content'>
        <div id='modal-heading'>
          <div id='welcome'>Welcome to the</div>
          <h1>ATLANTA REGION</h1>
          <h1>EVICTION TRACKER</h1>
        </div>

        <div id='modal-body'>
          {content ? (
            <>
              {content.alert ? util.AboutContent.Alert(content) : null}
              {util.AboutContent.Mission(content)}
              {util.AboutContent.Data(content)}
              {util.AboutContent.Team(content)}
              {util.AboutContent.Resources(content)}
              {util.AboutContent.Citations(content)}
              {util.AboutContent.DataRequest(content)}
              {util.AboutContent.Sources(
                { type: 'Court Record Data' },
                content
              )}
              {util.AboutContent.Sources({ type: 'Other Data' }, content)}
            </>
          ) : (
            <div className='spinner-container' style={config.loaderStyle}>
              <h1>Loading...</h1>
              <Circles
                id='loader-box'
                color={config.loaderStyle.color}
                type={config.loaderStyle.type}
              />
            </div>
          )}
        </div>
        <div id='modal-footer'>
          <Button onClick={() => setModalStatus(false)}>OK</Button>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  content: PropTypes.object,
  setModalStatus: PropTypes.func
};

export default Modal;