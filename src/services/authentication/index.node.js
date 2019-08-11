/* istanbul ignore file */
import auth from '@feathersjs/authentication';
import jwt from '@feathersjs/authentication-jwt';

export default function authentication() {
	return (app) => {
		app
			.configure(auth(app.get('authentication')))
			.configure(jwt());

		app.service('authentication').hooks({
			before: {
				create: [
					auth.hooks.authenticate(['jwt']),
				],
			},
		});
	};
}
