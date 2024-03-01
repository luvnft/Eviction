import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import './style.css';

const Header = ({
  countyFilter,
  countyOptions,
  setCountyFilter,
  setVizView,
  smallScreen,
  vizView
}) => {
  return (
    <div id='header'>
      <Link className='api-link' to='/api' aria-label='api-documentation'>
        API
      </Link>
      <h1>ATLANTA REGION EVICTION TRACKER</h1>
      <div id='county-dropdown-container'>
        {smallScreen ? (
          <select
            value={countyFilter}
            onChange={e => setCountyFilter(e.target.value)}
          >
            {countyOptions
              ? countyOptions.map(county => (
                <option
                  key={county.text}
                  value={county.value}
                  id={`option-${county.text}`}
                >
                  {county.text}
                </option>
              ))
              : null}
          </select>
        ) : (
          <Dropdown
            placeholder='Filter by County'
            fluid
            selection
            value={countyFilter}
            options={countyOptions}
            onChange={(e, data) => setCountyFilter(data.value)}
          />
        )}
      </div>
      <div id='viz-toggle'>
        <div
          className='viz-tab'
          id={vizView === 'map' ? 'active-viz-tab' : null}
          onClick={() => setVizView('map')}
        >
          <h3>MAP</h3>
        </div>
        <div
          className='viz-tab'
          id={vizView === 'chart' ? 'active-viz-tab' : null}
          onClick={() => setVizView('chart')}
        >
          <h3>CHART</h3>
        </div>
      </div>
    </div>
  );
};

Header.propTypes = {
  countyFilter: PropTypes.number,
  countyOptions: PropTypes.array,
  setCountyFilter: PropTypes.func,
  setVizView: PropTypes.func,
  vizView: PropTypes.string,
  smallScreen: PropTypes.bool
};

export default Header;