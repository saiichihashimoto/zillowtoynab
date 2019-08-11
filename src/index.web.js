/* istanbul ignore file */
import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './components/App';
import FeathersAppContext from './components/FeathersAppContext';
import app from './app';

ReactDOM.render(
	<FeathersAppContext.Provider value={app}>
		<App />
	</FeathersAppContext.Provider>,
	document.querySelector('#root')
);
