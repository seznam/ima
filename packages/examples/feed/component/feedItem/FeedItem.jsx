import AbstractComponent from 'ima/page/AbstractComponent';
import React from 'react';
import Date from 'app/component/date/Date';
import Share from 'app/component/share/Share';

/**
 * Feed item.
 */
export default class FeedItem extends AbstractComponent {
  render() {
    let entity = this.props.entity;
    let category = this.props.category;

    let sharedItemActive = this.props.sharedItem === entity;
    let singleItemClass = this.props.singleItem ? ' single-item' : '';

    let icon = this.getIcon(category);
    let hashTag = this.getHashTag(category);

    return (
      <div className={'feed-item' + singleItemClass}>
        {icon}
        <div className="content-wrapper">
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: entity.getContent() }}
          />
          <div className="toolbar">
            {hashTag}
            <Date date={entity.getPosted()} />
            <Share
              item={entity}
              category={category}
              active={sharedItemActive}
            />
          </div>
        </div>
      </div>
    );
  }

  getIcon(category) {
    if (category) {
      return (
        <div className="service-icon">
          <img
            src={this.utils.$Router.getBaseUrl() + category.getIconUrl()}
            alt={category.getName()}
          />
        </div>
      );
    }

    return '';
  }

  getHashTag(category) {
    if (category) {
      let link = this.link('category', { category: category.getUrlName() });

      return <a href={link}>{category.getHashTag()}</a>;
    }

    return '';
  }
}
