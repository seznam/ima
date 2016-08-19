import ns from 'ima/namespace';
import AbstractComponent from 'ima/page/AbstractComponent';
import React from 'react';

ns.namespace('app.component.filter');

/**
 * Feed writing.
 * @class View
 * @extends ima.page.AbstractComponent
 * @namespace app.component.filter
 * @module app
 * @submodule app.component
 */
class View extends AbstractComponent {

	constructor(props) {
		super(props);

		this.state = {
			expanded: false
		};
	}

	render() {
		let isExpandedClass = this.state.expanded ? ' expanded' : '';
		let topBar = this.getFilterTopBar(this.props.currentCategory);
		let categoryLinks = this.getCategoryLinks(this.props.categories);
		let allLink = this.getAllLink();

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
		let label = this.utils.$Dictionary.get('filter.label');
		let currentCategoryLabel = currentCategory ?
				currentCategory.getName() : this.utils.$Dictionary.get('filter.defaultCategory');

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
		let allLabel = this.utils.$Dictionary.get('filter.all');

		return (
			<a href={this.utils.$Router.link('home')} className='all'>
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
						let link = this.utils.$Router.link('category', {
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

ns.app.component.filter.View = View;
