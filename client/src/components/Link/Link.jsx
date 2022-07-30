import "./Link.scss";

const Link = ({ children, ...props }) => {
  return (
    <a className="basic-link" {...props}>
      {children}
    </a>
  );
};

export default Link;
