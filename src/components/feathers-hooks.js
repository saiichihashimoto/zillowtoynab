/* istanbul ignore file */
import useIsMounted from 'react-is-mounted-hook';
import { useCallback, useDebugValue, useEffect, useState } from 'react';

import { useEventEmitter } from './hooks';

// TODO Publish feathers hooks to npm

function useFeathersSetting(app, name, initialState) {
	const [state, setState] = useState(() => {
		const currentValue = app.get(name);

		return currentValue === undefined ? initialState : currentValue;
	});

	useDebugValue(state);

	useEventEmitter(app, `settingchange:${name}`, setState);

	return [
		state,
		useCallback((value) => {
			app.set(name, value);
			app.emit(`settingchange:${name}`, value);
		}, [app, name]),
	];
}

function useFeathersAuthentication(app) {
	const isMounted = useIsMounted();
	const [isAuthenticated, setIsAuthenticated] = useFeathersSetting(app, 'isAuthenticated', null);

	useDebugValue(isAuthenticated);

	const setIsAuthenticatedTrue = useCallback(() => {
		setIsAuthenticated(true);
	}, [setIsAuthenticated]);

	const setIsAuthenticatedFalse = useCallback(() => {
		setIsAuthenticated(false);
	}, [setIsAuthenticated]);

	useEffect(() => {
		async function checkStorage() {
			try {
				await app.authenticate();

				if (isMounted) {
					setIsAuthenticatedTrue();
				}
			} catch (err) {
				if (isMounted) {
					setIsAuthenticatedFalse();
				}
			}
		}

		if (app.get('hasAttemptedAuthentication')) {
			return;
		}
		app.set('hasAttemptedAuthentication', true);

		checkStorage();
	}, [app, isMounted, setIsAuthenticatedFalse, setIsAuthenticatedTrue]);

	useEventEmitter(app, 'authenticated', setIsAuthenticatedTrue);
	useEventEmitter(app, 'logout', setIsAuthenticatedFalse);

	return [isAuthenticated, app.authenticate, app.logout];
}

export {
	useFeathersAuthentication,
	useFeathersSetting,
};
