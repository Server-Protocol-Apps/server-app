export const Loading = ({ text = "Loading" }) => (
  <div className="flex flex-row items-baseline">
    <span>{text}</span>
    <div className="loader"></div>
  </div>
);
