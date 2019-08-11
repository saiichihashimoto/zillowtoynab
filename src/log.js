/* istanbul ignore file */
import bunyan from 'bunyan';

import { name } from '../package';

const log = bunyan.createLogger({
	name,
	serializers: bunyan.stdSerializers,
});

export default log;
