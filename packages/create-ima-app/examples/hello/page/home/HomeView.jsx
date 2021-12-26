import { PageContext, AbstractComponent } from '@ima/core';

import IMAjsLogoImg from './imajs-logo.png';
import './homeView.less';

export default class HomeView extends AbstractComponent {
  static get contextType() {
    return PageContext;
  }

  render() {
    return (
      <div className="l-homepage">
        <div className="content">
          <img src={IMAjsLogoImg} alt="IMA.js logo" />
          <h1>
            {`Hello, ${this.props.message} `}
            <a
              href="//imajs.io"
              title={this.props.name}
              target="_blank"
              rel="noopener noreferrer">
              {this.props.name}
            </a>
            !
          </h1>
        </div>
      </div>
    );
  }
}
