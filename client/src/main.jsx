import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import './index.css';
import './fonts/Noto_Sans_KR/NotoSansKR-Light.otf';

const root = createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>
);
