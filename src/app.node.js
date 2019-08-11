/* istanbul ignore file */
import auth from '@feathersjs/authentication';
import configuration from '@feathersjs/configuration';
import express from '@feathersjs/express';
import feathers from '@feathersjs/feathers';

export default express(feathers())
	.configure(configuration())
	.configure(express.rest())
	.use(express.json())
	.use(express.urlencoded({ extended: true }))
	.configure(auth({ secret: 'shhhh' }));
