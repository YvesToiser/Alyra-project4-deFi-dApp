import Box from "components/Box/Box";
import Logo from "components/Logo/Logo";
import "./VaultItem.scss";
import Button from "components/Button/Button";
import { useState } from "react";
import Link from "../Link/Link";

export default function VaultItem({ logo, name, apr, tvl }) {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails((_showDetails) => !_showDetails);
  };
  return (
    <Box>
      <div className="vault-item">
        <div className="vault-item__element">
          <Logo logoUrl={logo} />
        </div>
        <p className="vault-item__element">{name || "?"}</p>
        <p className="vault-item__element">{apr || "?"}</p>
        <p className="vault-item__element">{tvl || "?"} ETH</p>
        <Button className="vault-item__button" onClick={toggleDetails}>
          {showDetails ? "Hide Details" : " Show Details"}
        </Button>
      </div>
      <div className={`vault-item__details${showDetails ? "--show" : ""}`}>
        test
        <Link>Mon lien</Link>
      </div>
    </Box>
  );
}
