/* istanbul ignore file */
import configuration from '@feathersjs/configuration';
import express from '@feathersjs/express';
import feathers from '@feathersjs/feathers';
import memory from 'feathers-memory';

import authentication from './authentication';

export default express(feathers())
	.configure(configuration())
	.configure(express.rest())
	.use(express.json())
	.use(express.urlencoded({ extended: true }))
	.use('users', memory())
	.configure(authentication());
