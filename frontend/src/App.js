import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom'

import Routes from './Routes';

class App extends Component {
    componentWillMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange);
    }
    handleWindowSizeChange = () => {
        this.props.updateScreenWidth(window.innerWidth);
    };
    componentDidMount() {
        this.props.updateScreenWidth(window.innerWidth);
    }
    render() {
        return (<Router>
            <div className="f">
                <Routes/>
            </div>
        </Router>);
    }
}
// export default App
import { updateScreenWidth } from './actions/system'
import { connect } from 'react-redux'
function mapStateToProps (state) {
    return {
        sidebar: state.system.sidebar
    };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    updateScreenWidth: (w) => {
        dispatch(updateScreenWidth(w));
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(App);