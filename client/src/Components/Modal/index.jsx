import React from 'react';
import PropTypes from 'prop-types';
import { Circles } from 'react-loader-spinner';
import { Button } from 'semantic-ui-react';
import config from './config.js';
import {
  Alert,
  Mission,
  Data,
  Team,
  Resources,
  Citations,
  DataRequest,
  Sources
} from './AboutContent.jsx';
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
              {content.alert ? <Alert {...content} /> : null}
              <Mission {...content}/>
              <Data {...content}/>
              <Team {...content}/>
              <Resources {...content}/>
              <Citations {...content}/>
              <DataRequest {...content}/>
              <Sources {...content} type={'Court Record Data'} />
              <Sources {...content} type={'Other Data'} />
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