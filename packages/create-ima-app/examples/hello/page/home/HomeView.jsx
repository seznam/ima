import { useSettings, useLocalize } from '@ima/react-hooks';

import Card from 'app/component/card/Card';
import './homeView.less';

export default function HomeView(props) {
  const links = useSettings('links');
  const localize = useLocalize();

  return (
    <div className="page-home">
      <div className="content">
        <h1>
          {props.message}{' '}
          <a
            href="https://imajs.io"
            title={props.name}
            rel="noopener noreferrer">
            {props.name}
          </a>
          !
        </h1>

        <p
          className="hero"
          dangerouslySetInnerHTML={{ __html: localize('home.intro') }}></p>

        <div className="cards">
          <Card title="Documentation" href={links.documentation}>
            In the documentation you’ll find an{' '}
            <a href={links.documentation}>in depth look</a> to every part of the
            IMA.js framework.
          </Card>
          <Card title="Tutorial" href={links.tutorial}>
            The tutorial, which is always{' '}
            <a href={links.tutorial}>good place to start</a>, takes you through
            the build process of a simple guest book application.
          </Card>
          <Card title="Plugins" href={links.plugins}>
            IMA.js comes with full support for plugins, feel free to export{' '}
            <a href={links.plugins}>existing library</a> we maintain.
          </Card>
          <Card title="API" href={links.api}>
            This section provides direct look at the{' '}
            <a href={links.api}>framework’s API</a>.
          </Card>
        </div>
      </div>
    </div>
  );
}
