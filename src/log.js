/* istanbul ignore file */
import bunyan from 'bunyan';

import { name } from '../package';

export default bunyan.createLogger({
	name,
	serializers: bunyan.stdSerializers,
});
