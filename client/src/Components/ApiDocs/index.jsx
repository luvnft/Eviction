import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Tab, Dropdown, Icon } from 'semantic-ui-react';

import ApiDocBody from '../ApiDocBody/index.jsx';
import config from './config';
import './style.css';

const ApiDocs = () => {
  const [selectedDoc, setSelectedDoc] = useState(config.endpointData[0]);
  const isMobile = window.innerWidth < 1200;

  const endpointOptions = config.endpointData.map(obj =>
    !isMobile
      ? {
        menuItem: obj.title,
        render: () => (
          <Tab.Pane
            className='tab-pane'
            key={`${obj.endpoint}-pane`}
            attached={false}
          >
            <ApiDocBody {...obj} />
          </Tab.Pane>
        )
      }
      : {
        key: `${obj.endpoint}-dropdown-option`,
        text: obj.title,
        value: obj.title
      }
  );

  const handleDropdownSelect = value => {
    const selectedDoc = config.endpointData.filter(
      ({ title }) => title === value
    )[0];
    setSelectedDoc(selectedDoc);
  };

  return (
    <main>
      <Link className='api-link' to='/'>
        <div>
          <Icon aria-label='back' name='arrow alternate circle left outline' />
          Eviction Tracker
        </div>
      </Link>
      <Container id='docs-container' fluid>
        <h1>{config.title}</h1>

        <p>{config.description}</p>

        <h2>Base URL</h2>

        <p>{config.baseURL}</p>

        <h2>Endpoints</h2>

        {!isMobile ? (
          <Tab
            menu={{
              fluid: true,
              vertical: false,
              tabular: true,
              pointing: true,
              secondary: true
            }}
            panes={endpointOptions}
          />
        ) : (
          <>
            <Dropdown
              selection
              className='mobile-dropdown'
              value={selectedDoc.title}
              options={endpointOptions}
              onChange={(e, data) => handleDropdownSelect(data.value)}
              closeOnChange
            />
            <div id='mobile-doc-container'>
              <ApiDocBody {...selectedDoc} />
            </div>
          </>
        )}
      </Container>
    </main>
  );
};

export default ApiDocs;