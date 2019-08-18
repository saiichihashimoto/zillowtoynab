/* istanbul ignore file */
import configuration from '@feathersjs/configuration';
import express from '@feathersjs/express';
import feathers from '@feathersjs/feathers';

import authentication from './services/authentication';
import users from './services/users';

export default express(feathers())
	.configure(configuration())
	.configure(express.rest())
	.use(express.json())
	.use(express.urlencoded({ extended: true }))
	.use('users', users())
	.configure(authentication());
