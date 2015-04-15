import ns from 'imajs/client/core/namespace.js';

var boot = ns.oc.get('$Boot');

boot.addComponent(() => {

	ns.namespace('App.Component.Filter');

	/**
	 * Feed writing.
	 * @class View
	 * @namespace App.Component.Filter
	 * @module App
	 * @submodule App.Component
	 */
	/* jshint ignore:start */
	ns.App.Component.Filter.View = React.createClass({
		render() {
			var isExpandedClass = this.props.expanded ? ' expanded' : '';
			var topBar = this.getFilterTopBar(this.props.currentCategory);
			var categoryLinks = this.getCategoryLinks(this.props.categories);
			var allLink = this.getAllLink();

			return (
				<div className={'filter' + isExpandedClass}>
					{topBar}
					<div className='categories'>
						{allLink}
						{categoryLinks}
					</div>
				</div>
			);
		},

		getFilterTopBar(currentCategory) {
			var dictionary = ns.oc.get('$Dictionary');
			var label = dictionary.get('filter.label');
			var currentCategoryLabel = currentCategory ?
					currentCategory.getName() : dictionary.get('filter.defaultCategory');

			return (
				<div className='top'>
					{label}
					<span className='toggle' onClick={this.onToggle}>
						{currentCategoryLabel}
					</span>
				</div>
			);
		},

		getAllLink() {
			var router = ns.oc.get('$Router');
			var dictionary = ns.oc.get('$Dictionary');
			var allLabel = dictionary.get('filter.all');

			return (
				<a href={router.link('home')} className='all'>
					{allLabel}
				</a>
			);
		},

		getCategoryLinks(categories) {

			if (categories) {
				var router = ns.oc.get('$Router');

				return (
					categories
						.getCategories()
						.map((category, index) => {
							var link = router.link('category', {
								category: category.getUrlName()
							});

							return (
								<a href={link} key={`category-${index}`}>
									{category.getName()}
								</a>
							);
						})
				);
			}

			return '';
		},

		onToggle() {
			var dispatcher = ns.oc.get('$Dispatcher');
			dispatcher.fire('filterToggle');
		}
	});
	/* jshint ignore:end */
});