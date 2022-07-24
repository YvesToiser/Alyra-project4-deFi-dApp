import "./Button.scss";
export default function Button({ id, className, onClick, children }) {
  return (
    <button id={id} className={`btn ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}
