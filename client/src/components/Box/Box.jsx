import "./Box.scss";
export default function Box(props) {
  return <div className={`box ${props.className}`}>{props.children}</div>;
}
