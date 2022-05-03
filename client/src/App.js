import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Dashboard from './Components/Dashboard';
import ApiDocs from './Components/ApiDocs';

const App = () => {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="api" element={<ApiDocs />} />
            </Routes>
        </div>
    )
}

export default App;