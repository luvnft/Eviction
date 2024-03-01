import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import './style.css';

const Footer = ({ dateRange }) => {
  return (
    <div id='footer'>
      <div>
        Current as of{' '}
        {dateRange ? moment(dateRange.end).format('MMMM Do, YYYY') : null}
      </div>
      <div id='footer-text'>Developed by</div>
      <div id='footer-logos'>
        <div id='left-logo'>
          <img
            src={
              'https://neighborhoodnexus.org/wp-content/uploads/2021/12/FedLogo1.png'
            }
            alt='Fed-logo'
          />
        </div>
        <div id='center-logo'>
          <img
            src={
              'https://atlantaregional.org/wp-content/uploads/arc-logo-webinar.png'
            }
            alt='ARC-logo'
          />
        </div>
        <div id='right-logo'>
          <p className='partner-names'>
            <span>{'Georgia Tech\'s'}</span> <br />
            School of City and Regional Planning (SCaRP) {'&'}
          </p>
          <p className='partner-names'>
            Center for Spatial Planning Analytics and Visualization (CSPAV)
          </p>
        </div>
      </div>
    </div>
  );
};

Footer.propTypes = {
  dateRange: PropTypes.object
};

export default Footer;