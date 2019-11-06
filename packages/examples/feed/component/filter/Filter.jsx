import AbstractComponent from 'ima/page/AbstractComponent';
import React from 'react';

/**
 * Feed filter.
 */
export default class Filter extends AbstractComponent {
  constructor(props, context) {
    super(props, context);

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
        <div className="categories">
          {allLink}
          {categoryLinks}
        </div>
      </div>
    );
  }

  getFilterTopBar(currentCategory) {
    let label = this.localize('filter.label');
    let currentCategoryLabel = currentCategory
      ? currentCategory.getName()
      : this.localize('filter.defaultCategory');

    return (
      <div className="top">
        {label}
        <span className="toggle" onClick={() => this.onToggle()}>
          {currentCategoryLabel}
        </span>
      </div>
    );
  }

  getAllLink() {
    let allLabel = this.localize('filter.all');

    return (
      <a href={this.link('home')} className="all">
        {allLabel}
      </a>
    );
  }

  getCategoryLinks(categories) {
    if (!categories) {
      return null;
    }

    return categories.getCategories().map((category, index) => {
      let link = this.link('category', {
        category: category.getUrlName()
      });

      return (
        <a href={link} key={`category-${index}`}>
          {category.getName()}
        </a>
      );
    });
  }

  onToggle() {
    this.setState({
      expanded: !this.state.expanded
    });
  }
}
