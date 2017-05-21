import React from 'react';

const SettingsHeader = ({title}) => (
   <div>
       <h1 className="settingsHeaderText">{title}</h1>
       <hr className="settingsHR"/>
   </div>
);

export default SettingsHeader;