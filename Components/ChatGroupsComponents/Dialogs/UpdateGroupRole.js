"use client";
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";

const UpdateGroupRoleDialog = ({ open, onClose, groupId }) => {
  const handleConfirm = () => {
    console.log("Confirmed role update for group:", groupId);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <h1 className="text-lg font-semibold">Change Role for Group</h1>
        <p className="text-sm text-gray-600 mt-2">
          Are you sure you want to change the role for group ID: <strong>{groupId}</strong>?
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="secondary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateGroupRoleDialog;
