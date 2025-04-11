import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

/**
 * A reusable dialog that prompts the user to log in.
 *
 * @param {LoginDialogProps} props - Props for controlling dialog state.
 * @returns {JSX.Element} Login dialog component
 */
const LoginDialog = ({ open, onClose }: LoginDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Login Required</DialogTitle>
      <DialogContent>You need to log in first.</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginDialog;
