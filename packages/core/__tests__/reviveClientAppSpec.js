import React from 'react';
import jsdom from 'jsdom';
import $Helper from 'ima-helpers';
import ControllerInterface from '../controller/Controller';
import AbstractDocumentView from '../page/AbstractDocumentView';
import * as ima from '../main';
import vendorLinker from '../vendorLinker';

describe('Revive client application', () => {
	let router = null;
	let ReactDOM = {
		render() {
			return {
				setState: () => {}
			};
		},
		hydrate() {
			return {
				setState: () => {}
			};
		}
	};

	let routerConfig = {
		$Protocol: 'http:',
		$Root: '',
		$LanguagePartPath: '',
		$Host: 'www.domain.com'
	};

	function View() {
		return React.createElement('div', {});
	}

	class DocumentView extends AbstractDocumentView {
		static get masterElementId() {}
	}

	class Controller extends ControllerInterface {
		getHttpStatus() {
			return 200;
		}

		getExtensions() {
			return [];
		}

		load() {
			return { hello: 'Hello' };
		}
	}

	let options = {
		onlyUpdate: false,
		autoScroll: true,
		allowSPA: true,
		documentView: DocumentView
	};

	function propagateToGlobal(win) {
		for (let key of Object.keys(win)) {
			global[key] = global[key] ? global[key] : win[key];
		}
	}

	beforeAll(done => {
		let doc = Reflect.construct(jsdom.JSDOM, [
			`<!DOCTYPE html><html><head></head><body></body></html>`
		]);

		propagateToGlobal(doc.window);

		global.$IMA = Object.assign({}, global.$IMA || {}, routerConfig, {
			$Env: 'prod',
			$Version: 1
		});

		global.document = doc.window.document;
		global.window = doc.window;
		global.window.$IMA = global.$IMA;
		global.window.$Debug = global.$Debug;
		doc.reconfigure({
			url: `${routerConfig.$Protocol}//${routerConfig.$Host}`
		});

		//mock
		global.window.scrollTo = () => {};

		vendorLinker.set('react', React);
		vendorLinker.set('react-dom', ReactDOM);
		vendorLinker.set('ima-helpers', $Helper);

		spyOn(ReactDOM, 'render');

		done();
	});

	it('revive client app', done => {
		let bootConfig = Object.assign(
			{
				initServicesApp: () => {},
				initBindApp: () => {},
				initRoutes: () => {},
				initSettings: () => {
					return {
						prod: {
							$Page: {
								$Render: {}
							}
						}
					};
				}
			},
			{
				initBindApp: (ns, oc, config) => {
					router = oc.get('$Router');
					router.init(routerConfig);
					router.add(
						'reviveClientApp',
						'/',
						Controller,
						View,
						options
					);

					oc.inject(Controller, []);

					if (!oc.has('$Utils')) {
						oc.constant('$Utils', {});
					}
				}
			}
		);

		ima
			.reviveClientApp(bootConfig)
			.then(response => {
				expect(response.status).toEqual(200);
				expect(response.pageState).toEqual({ hello: 'Hello' });
				expect(response.content).toEqual(null);
				expect(ReactDOM.render).toHaveBeenCalled();
				done();
			})
			.catch(error => {
				done(error);
			});
	});
});
