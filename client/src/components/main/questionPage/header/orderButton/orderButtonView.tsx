import "./orderButtonView.css";
import { OrderButtonProps } from "../../../../../types/pageTypes";
import Button from "@mui/material/Button";

/**
 * A component for order buttons
 * @param param0 the order name to be displayed and the function to change the order
 * @returns the order button
 */
const OrderButton = ({ message, setQuestionOrder }: OrderButtonProps) => {
  return (
    <Button
      variant="outlined"
      size="small"
      className="btn"
      onClick={() => {
        setQuestionOrder(message);
      }}
    >
      {message}
    </Button>
  );
};

export default OrderButton;
