/* istanbul ignore file */
import express from 'express';

import log from './log';

const port = process.env.PORT;

const app = express();

app.get('/', (req, res) => {
	res.send('hello world');
	log.info({ req, res }, 'hello world!');
});

app.listen(port, () => log.info({ port }, 'Ready for requests'));
