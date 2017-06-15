import React from 'react';
import logo from '../assets/images/logo.png'
import PropTypes from 'prop-types';

const Sidebar = ({upper, lower, isMobile, toggleSidebar}) =>
    <div className="col left">
        <div className="col-top-left-brand">
            <img src={logo} alt="logo" className="sidebar-logo" />
            {isMobile &&  <div onClick={toggleSidebar}>[hide sidebar]</div>}
        </div>
        <div className="col-bottom sidebar-wrapper">
            <div id="sidebar-upper">
                {upper}
            </div>
            <div id="sidebar-lower">
                {lower}
            </div>
        </div>
    </div>;

Sidebar.propTypes = {
    upper: PropTypes.Array,
    lower: PropTypes.Array,
    isMobile: PropTypes.bool,
    toggleSidebar: PropTypes.func,
};

Sidebar.displayName = "Sidebar";

export default Sidebar;