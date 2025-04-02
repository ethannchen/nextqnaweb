import "./orderButtonView.css";
import { OrderButtonProps } from "../../../../../types/pageTypes";

/**
 * A component for order buttons
 * @param param0 the order name to be displayed and the function to change the order
 * @returns the order button
 */
const OrderButton = ({ message, setQuestionOrder }: OrderButtonProps) => {
  return (
    <button
      className="btn"
      onClick={() => {
        setQuestionOrder(message);
      }}
    >
      {message}
    </button>
  );
};

export default OrderButton;
