import ns from 'imajs/client/core/namespace.js';
import bootstrap from 'imajs/client/core/bootstrap.js';

bootstrap.addComponent((utils) => {

	ns.namespace('App.Component.Filter');

	/**
	 * Feed writing.
	 * @class View
	 * @namespace App.Component.Filter
	 * @module App
	 * @submodule App.Component
	 */
	class View extends React.Component {

		constructor(props) {
			super(props);

			this.state = {
				expanded: false
			};
		}

		render() {
			var isExpandedClass = this.state.expanded ? ' expanded' : '';
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
		}

		getFilterTopBar(currentCategory) {
			var label = utils.$Dictionary.get('filter.label');
			var currentCategoryLabel = currentCategory ?
					currentCategory.getName() : utils.$Dictionary.get('filter.defaultCategory');

			return (
				<div className='top'>
					{label}
					<span className='toggle' onClick={()=>this.onToggle()}>
						{currentCategoryLabel}
					</span>
				</div>
			);
		}

		getAllLink() {
			var allLabel = utils.$Dictionary.get('filter.all');

			return (
				<a href={utils.$Router.link('home')} className='all'>
					{allLabel}
				</a>
			);
		}

		getCategoryLinks(categories) {

			if (categories) {

				return (
					categories
						.getCategories()
						.map((category, index) => {
							var link = utils.$Router.link('category', {
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
		}

		onToggle() {
			this.setState({
				expanded: !this.state.expanded
			});
		}
	}
	
	ns.App.Component.Filter.View = View;
});