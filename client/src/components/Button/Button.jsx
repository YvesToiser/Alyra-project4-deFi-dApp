import "./Button.scss";
export default function Button(props) {
  return (
    <button id={props.id} className="btn" onClick={props.onClick}>
      {props.children}
    </button>
  );
}
