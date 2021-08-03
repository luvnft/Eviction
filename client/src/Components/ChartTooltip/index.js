import React from 'react';
import numeral from 'numeral';
import moment from 'moment';

export default ({ active, payload, label }, timeScale, indicator1, indicator2, countyFilter, county) => {
  const info = payload[0] ? payload[0].payload : {}; 
  const dateInfo = timeScale === 'weekly' ? 
    <span>
      between <span className='tooltip-data'>{moment(label).format('M/D/YY')}</span> and <span className='tooltip-data'>{moment(label).endOf('week').format('M/D/YY')}</span> 
    </span> : timeScale === 'monthly' ?
      <span>
        in <span className='tooltip-data'>{moment(label).format('MMMM YYYY')}</span>  
      </span> : timeScale === 'daily' ?
        <span>
          on <span className='tooltip-data'>{moment(label).format('dddd, MMMM Do YYYY')}</span>  
        </span> : null;

  const totalFilings = info[indicator1] && info[indicator2] ? numeral(info[indicator1] + info[indicator2]).format('0,0') : '?';
  const totalAnswers = info[indicator2] ? numeral(info[indicator2]).format('0,0') : '?';
  const answerRate = info[indicator1] && info[indicator2] ? numeral(info[indicator2]/(info[indicator1] + info[indicator2])).format('0.0%') : '?';
  const total2019 = info['Baseline (Total Filings, 2019)'] ? numeral(info['Baseline (Total Filings, 2019)']).format('0,0') : '?';

  return active ?
      <div className='tooltip-content chart-tooltip-content'>
        <div>
          In {countyFilter === 999 || countyFilter === '999' 
            ? 'the ' 
            : ''} <span className='tooltip-data'>
                {county.text}
              </span> {dateInfo}, there were <span className='tooltip-data'>{totalFilings}</span> reported eviction filings of which <span className='tooltip-data'>{totalAnswers} ({answerRate})</span> have been answered. In comparison, there were <span className='tooltip-data'>{total2019}</span> filings for the same duration in 2019.
        </div>

      </div>
  : null;
}