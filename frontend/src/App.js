import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import Routes from './Routes';

const App = () => (
        <Router>
            <div className="f">
                    <Routes/>
            </div>
        </Router>
)
export default App