import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import Nav from './components/Nav';
import Routes from './Routes';

const App = () => (
        <Router>
            <div className="f">
                {/*<Nav/>*/}
                {/*<div className="container">*/}
                    <Routes/>
                {/*</div>*/}
            </div>
        </Router>
)
export default App