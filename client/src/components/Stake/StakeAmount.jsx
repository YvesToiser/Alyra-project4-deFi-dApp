import "./stake.css";
export default function stakeAmount({ text }) {
  //composant IconeText
  return (
    <div className="stakeAmount">
      <h2>Stake</h2>
      <i>icone</i>
      <div className="stake">
        <p>0.0</p>
        <p>0 usd</p>
      </div>
      <h3>Balance </h3>
      <div className="prcnt">
        <p>25%</p>
      </div>
      <p>50%</p>
      <p>75%</p>
      <p>Max</p>
      <p>Annual ROI at current rates</p>
    </div>
  );
}
