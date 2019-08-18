/* istanbul ignore file */
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication';
import { expressOauth } from '@feathersjs/authentication-oauth';

export default function authentication() {
	return (app) => {
		const service = new AuthenticationService(app);

		service.register('jwt', new JWTStrategy());

		app
			.use('/authentication', service)
			.configure(expressOauth());
	};
}
