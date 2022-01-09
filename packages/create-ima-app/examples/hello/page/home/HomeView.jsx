import Card from 'app/component/card/Card';

import './homeView.less';

export default function HomeView(props) {
  return (
    <div className="l-homepage">
      <div className="content">
        <h1>
          Welcome to{' '}
          <a
            href="https://imajs.io"
            title={props.appName}
            rel="noopener noreferrer">
            {props.appName}
          </a>
          !
        </h1>

        <p className="hero">
          Get started by editing <code>app/home/HomeView.jsx</code> or pick one
          of the following topics!
        </p>

        <div className="cards">
          <Card title="Documentation" href="https://imajs.io/docs">
            In the documentation you’ll find an{' '}
            <a href="https://imajs.io/tutorial/introduction">in depth look</a>{' '}
            to every part of the IMA.js framework.
          </Card>
          <Card title="Tutorial" href="https://imajs.io/tutorial/introduction">
            In the tutorial you’ll build a simple guest book application with.
            It’s always a{' '}
            <a href="https://imajs.io/docs">good place to start</a>.
          </Card>
          <Card title="Plugins" href="https://github.com/seznam/IMA.js-plugins">
            IMA.js comes with full support for plugins, feel free to export{' '}
            <a href="https://github.com/seznam/IMA.js-plugins">
              existing library
            </a>{' '}
            we maintain.
          </Card>
          <Card title="API" href="https://imajs.io/api">
            This section provides direct look at the{' '}
            <a href="https://imajs.io/api">framework’s API</a>.
          </Card>
        </div>
      </div>
    </div>
  );
}
