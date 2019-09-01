/* istanbul ignore file */
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication';
import { OAuthStrategy, expressOauth } from '@feathersjs/authentication-oauth';

export default function authenticationService() {
	return (app) => {
		const service = new AuthenticationService(app);

		const authentication = app.get('authentication');

		app.set('authentication', {
			...authentication,
			oauth: {
				...authentication.oauth,
				defaults: {
					...authentication.oauth.defaults,
					host: authentication.oauth.defaults.host.replace(/^https?:\/\//u, ''),
				},
			},
		});

		service.register('jwt', new JWTStrategy());
		// TODO PR back to https://github.com/simov/grant
		service.register('ynab', new OAuthStrategy());

		app
			.use('/authentication', service)
			.configure(expressOauth({ authService: 'authentication' }));
	};
}
