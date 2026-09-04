import { SENTINEL_TO_EXTENSION } from '@/utils';

import { Actions } from '@/constants';

function detectImaAppCode() {
  return `(() => {
		// Notify extension that ima detection script have been injected
		window.postMessage({ sentinel: '${SENTINEL_TO_EXTENSION}', action: '${Actions.DETECTING}' }, '*');

		window.$IMA = window.$IMA || {};
		window.$IMA.devtool = window.$IMA.devtool || {};
		window.$IMA.devtool.postMessage = (payload, action = null) => {
			window.postMessage(
				Object.assign(
					{ sentinel: '${SENTINEL_TO_EXTENSION}', action: action ? action : '${Actions.MESSAGE}' },
					{ payload: payload }
				),
				'*'
			);
		}

		if ($IMA.Runner) {
			window.postMessage({ sentinel: '${SENTINEL_TO_EXTENSION}', action: '${Actions.ALIVE}' }, '*');

			$IMA.Runner.originalRun = $IMA.Runner.run;
			$IMA.Runner.run = () => {
			};
			$IMA.Runner.preRunCommands = [];
			$IMA.Runner.registerPreRunCommand = (command) => {
				$IMA.Runner.preRunCommands.push(command);
			};
		} else {
			Object.defineProperty(window.$IMA, 'Runner', {
				set(value) {
					if (value === this.__Runner) {
						return;
					}

					if (!this.__Runner) {
						window.postMessage({
							sentinel: '${SENTINEL_TO_EXTENSION}', action: '${Actions.ALIVE}', payload: {
								version: window.$IMA.$Version,
								language: window.$IMA.$Language,
								env: window.$IMA.$Env
							}
						}, '*');
					}

					value.originalRun = value.run;
					value.run = () => {
					};
					value.preRunCommands = [];
					value.registerPreRunCommand = (command) => {
						value.preRunCommands.push(command);
					};
					this.__Runner = value;
				},
				get() {
					return this.__Runner;
				}
			});
		}

		// Notify extension that ima was not found
		window.addEventListener('load', () => {
			if (!$IMA.Runner) {
				window.postMessage({ sentinel: '${SENTINEL_TO_EXTENSION}', action: '${Actions.DEAD}' }, '*');
			}
		});
	})()`;
}

export { detectImaAppCode };
