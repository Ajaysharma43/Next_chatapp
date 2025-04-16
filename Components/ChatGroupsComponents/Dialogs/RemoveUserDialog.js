import { Dialog, DialogContent, DialogActions } from "@mui/material";

export const RemoveUserFromGroup = ({ open, onClose, userDetails, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent className="text-center py-6">
        <h2 className="text-lg font-semibold text-red-600 mb-4">
          Remove Member
        </h2>
        <p className="text-gray-700">
          Are you sure you want to remove{" "}
          <span className="font-semibold text-black">
            {userDetails?.name}
          </span>{" "}
          from the group?
        </p>
      </DialogContent>
      <DialogActions className="flex justify-center pb-4 gap-4">
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Yes, Remove
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </DialogActions>
    </Dialog>
  );
};
