/* istanbul ignore file */
import React, { useContext } from 'react';
import { useAuthentication } from 'feathers-react-hooks';

import FeathersAppContext from '../FeathersAppContext';

function App() {
	const app = useContext(FeathersAppContext);
	const isAuthenticated = useAuthentication(app);

	return (
		<>
			<a href={`${process.env.REACT_APP_BACKEND_URL}/oauth/ynab`}>Auth</a>
			<br />
			{JSON.stringify(isAuthenticated)}
		</>
	);
}

export default App;
