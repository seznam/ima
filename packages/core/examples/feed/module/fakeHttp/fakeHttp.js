import ns from 'imajs/client/core/namespace.js';

ns.namespace('App.Module');

/**
 * Fake data for demo example.
 *
 * @class FakeHttp
 * @namespace App.Module
 * @module App
 * @submodule App.Module
 */
class FakeHttp {
	/**
	 * @constructor
	 * @method constructor
	 */
	constructor(promise) {

		this._promise = promise;

		this.categories = [
			{
				hashtag: '#red',
				_id: 1,
				name: 'Red items',
				urlname: 'red-items',
				iconurl: '/static/img/icons/red-icon.png'
			},
			{
				hashtag: '#green',
				_id: 2,
				name: 'Green items',
				urlname: 'green-items',
				iconurl: '/static/img/icons/green-icon.png'
			},
			{
				hashtag: '#blue',
				_id: 3,
				name: 'Blue items',
				urlname: 'blue-items',
				iconurl: '/static/img/icons/blue-icon.png'
			}
		];

		this.items = [
			{
				_id: 1,
				content: 'Isomorphic from the Greek "isos" for "equal" and "morph" for "shape". Isomorphism describes that if you look at the same entity in two different contexts, you should get the same thing.',
				category: 1,
				date: 'March 11, 2015 11:39:14'
			}, {
				_id: 2,
				content: 'In isomorphic javascript aplications are two contexts for one entity - server and client. Although the term has been mostly used in mathematics until now, it\'s an apt term to describe a web programing pattern where the code is shared by the front-end and back-end.',
				category: 2,
				date: 'March 15, 2015 17:50:00'
			}, {
				_id: 3,
				content: 'There are various isomorphic frameworks and libraries. <strong>This</strong> is one of them.',
				category: 1,
				date: 'March 18, 2015 13:30:19'
			}, {
				_id: 4,
				content: 'Google can now crawl JavaScript applications on websites.',
				category: 3,
				date: 'March 20, 2015 07:09:10'
			}, {
				_id: 5,
				content: 'Faster to render HTML content, directly in the browser. Better overall user experience.',
				category: 2,
				date: 'March 26, 2015 11:32:44'
			}, {
				_id: 6,
				content: 'JavaScript applications which run both client-side and server-side. <strong>Isomorphic JavaScript frameworks</strong> are the next step in the evolution of JavaScript frameworks. These new libraries and frameworks are solving the problems associated with traditional JavaScript frameworks.',
				category: 1,
				date: 'March 27, 2015 11:32:44'
			}
		];

		/**
		 * Id generator for posted items.
		 *
		 * @property nextId
		 * @private
		 * @type {number}
		 */
		this._nextId = this.items.slice().pop()._id+1;
	}

	/**
	 * Gets all items
	 *
	 * @method
	 * return {Object} - Json object with all items.
	 */
	get(url, data = {}) {
		switch(url) {
			case '/items':
				var items = this.items;

				if (data.id) {
					var id = Number(data.id);
					var singleItem = this.items.filter((item) => {
						return item._id === id;
					});
					if (singleItem[0]) {
						return this._promise.resolve(singleItem[0]);
					}
					return this._promise.reject(ns.oc.create('$Error', 'Bad request', { status: 404, url: url }));
				}

				if (data.category) {
					var items = this.items.filter((item) => {
						return item.category === data.category;
					});
				}

				return this._promise.resolve({ 'items': items });
			case '/categories':
				return this._promise.resolve({ 'categories': this.categories });
			default: 
				return this._promise.reject(ns.oc.create('$Error', 'Bad request', { status: 404, url: url }));
		}
	}

	/**
	 * Post item
	 *
	 * @method
	 * return {Object} - Json object with all items.
	 */
	post(url, data = {}) {

		switch(url) {
			case '/items':
				data._id = this._nextId;
				data.date = new Date().toString();
				this._nextId++;
				this.items.push(data);

				return this._promise.resolve(data);
			default: 
				return this._promise.reject(ns.oc.create('$Error', 'Bad request', { status: 500, url: url }));
		}
	}
	
}

ns.App.Module.FakeHttp = FakeHttp;