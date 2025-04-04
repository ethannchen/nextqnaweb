import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function SignupDialog({ open, handleClose }: { open: boolean, handleClose: () => void }) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const email = formJson.email;
    console.log(email);  // For now, just log the email
    handleClose();  // Close the dialog after submission
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Sign Up</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter your email address to sign up. We will send updates occasionally.
        </DialogContentText>
        <form onSubmit={handleSubmit}>
          <TextField
            autoFocus
            required
            margin="dense"
            id="email"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Sign Up</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
