import AbstractPageController from 'app/page/AbstractPageController';

export default class NotFoundController extends AbstractPageController {

	static get $dependencies() {
		return [];
	}

	constructor() {
		super();

		this.status = 404;
	}

	/**
	 * @return {{status: number}}
	 */
	load() {
		return {
			status: this.status
		};
	}
}
