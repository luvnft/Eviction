import React from 'react';
import moment from 'moment';

const DateInfo = (propObj) => {
  return propObj.timeScale === 'weekly' ? (
    <span>
      between{' '}
      <span className='tooltip-data'>
        {moment(propObj.label, 'MM/DD/YYYY').format('M/D/YY')}
      </span>{' '}
      and{' '}
      <span className='tooltip-data'>
        {moment(propObj.label, 'MM/DD/YYYY').endOf('week').format('M/D/YY')}
      </span>
    </span>
  ) : propObj.timeScale === 'monthly' ? (
    <span>
      in{' '}
      <span className='tooltip-data'>
        {moment(propObj.label, 'MM/DD/YYYY').format('MMMM YYYY')}
      </span>
    </span>
  ) : propObj.timeScale === 'daily' ? (
    <span>
      on{' '}
      <span className='tooltip-data'>
        {moment(propObj.label, 'MM/DD/YYYY').format('dddd, MMMM Do YYYY')}
      </span>
    </span>
  ) : null;
};
export default DateInfo;