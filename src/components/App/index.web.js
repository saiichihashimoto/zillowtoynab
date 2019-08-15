/* istanbul ignore file */
import { useAuthentication } from 'feathers-react-hooks';
import { useContext } from 'react';

import FeathersAppContext from '../FeathersAppContext';

function App() {
	const app = useContext(FeathersAppContext);
	const isAuthenticated = useAuthentication(app);

	return JSON.stringify(isAuthenticated);
}

export default App;
