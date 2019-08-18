/* istanbul ignore file */
import feathers from '@feathersjs/client';

import authentication from './services/authentication';

export default feathers()
	.configure(feathers.rest(process.env.REACT_APP_BACKEND_URL).fetch(window.fetch))
	.configure(authentication());
