/* istanbul ignore file */
import { useContext } from 'react';

import { useFeathersAuthentication } from '../feathers-hooks';
import FeathersAppContext from '../FeathersAppContext';

function App() {
	const app = useContext(FeathersAppContext);
	const [isAuthenticated] = useFeathersAuthentication(app);

	return JSON.stringify(isAuthenticated);
}

export default App;
