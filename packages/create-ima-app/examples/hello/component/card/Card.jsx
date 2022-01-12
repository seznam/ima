import './card.less';

export default function Card({ children, title, href }) {
  return (
    <div className="card">
      <a className="card-title" href={href}>
        <h3>{title} &raquo;</h3>
      </a>
      <p className="card-content">{children}</p>
    </div>
  );
}
