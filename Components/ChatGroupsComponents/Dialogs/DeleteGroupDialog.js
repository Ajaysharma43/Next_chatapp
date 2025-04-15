// components/DeleteDialog.jsx
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";

const DeleteDialog = ({ open, onClose, groupId, onConfirm }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent>
                <h2 className="text-lg font-semibold mb-2">Confirm Delete</h2>
                <p className="text-sm text-gray-600">
                    Are you sure you want to delete this group?
                </p>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button onClick={() => onConfirm(groupId)} color="error" variant="contained">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteDialog;
