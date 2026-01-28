import './card.less';

export function Card({ children, title, href }) {
  return (
    <div className='card'>
      <a className='card-title' target='_blank' href={href} rel='noreferrer'>
        <h3>{title}&nbsp;&raquo;</h3>
      </a>
      <p
        className='card-content'
        dangerouslySetInnerHTML={{
          __html: children.replaceAll('{link}', href),
        }}
      />
    </div>
  );
}
