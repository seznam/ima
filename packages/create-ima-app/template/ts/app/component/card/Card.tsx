import { CardData } from 'app/types';
import './card.less';

export interface CardProps {
  children: CardData['content'];
  title: CardData['title'];
  href: string;
}

export const Card: React.FC<CardProps> = ({ children, title, href }) => (
  <div className='card'>
    <a className='card-title' target='_blank' href={href} rel='noreferrer'>
      <h3>{title} &raquo;</h3>
    </a>
    <p
      className='card-content'
      dangerouslySetInnerHTML={{
        __html: children.replaceAll('{link}', href),
      }}
    />
  </div>
);
