import React from 'react';
import numeral from 'numeral';

const MapTooltip = propObj => (
  <div className='tooltip-content'>
    <div>
      {!propObj.selectedMonth.includes('Pandemic') ? 'In ' : ''}{' '}
      <span className='tooltip-data'>
        {
          propObj.monthOptions.find(
            month => month.value === propObj.selectedMonth
          ).text
        }
      </span>
    </div>
    <div>
      in census tract <span className='tooltip-data'>{propObj.clickID}</span>
    </div>

    <div>
      there{' '}
      {propObj.selectedMonth !== 'During the Pandemic**' ? 'were' : 'have been'}{' '}
      <span className='tooltip-data'>
        {numeral(propObj.rawTractData[propObj.clickID]).format('0,0')}
      </span>{' '}
      total reported eviction filings
    </div>
    <div>
      resulting in an eviction filing rate of{' '}
      <span className='tooltip-data'>
        {numeral(propObj.tractData[propObj.clickID]).format('0.0')}%
      </span>
      .
    </div>
  </div>
);

export default MapTooltip;