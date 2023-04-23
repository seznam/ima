import { useSettings, useLocalize } from '@ima/react-page-renderer';
import { Card } from 'app/component/card/Card';
import { CardData } from 'app/page/home/HomeController';
import { useState, useEffect } from 'react';
import './homeView.less';

export interface HomeViewProps {
  message: string;
  name: string;
  cards: CardData;
}

/**
 * The `load` method in HomeController.js passes entries
 * in the returned object as props to this component view. The
 * data are passed all at once, as soon as all promises resolve
 * (in case of SSR) or one by one as the promises are being resolved.
 */
export function HomeView({ message, name, cards }: HomeViewProps) {
  const links = useSettings('links') as Record<string, string>;
  const localize = useLocalize();
  const [mounted, setMounted] = useState(false);

  // This executes only on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className='page-home'>
      <div className='content'>
        <h1>
          {message}{' '}
          <a
            target='_blank'
            href='https://imajs.io'
            title={name}
            rel='noopener noreferrer'
          >
            {name}
          </a>
        </h1>

        <p
          className='hero'
          dangerouslySetInnerHTML={{ __html: localize('home.intro') }}
        ></p>

        <div className='cards'>
          {cards?.map(card => (
            <Card key={card.id} title={card.title} href={links[card.id] ?? ''}>
              {card.content}
            </Card>
          )) ?? null}
        </div>

        {mounted && <div className='mounted'>💡</div>}
      </div>
    </div>
  );
}
