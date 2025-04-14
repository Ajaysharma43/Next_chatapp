import { Dialog, DialogContent } from "@mui/material";

const UnBlockDialog = ({ open, onClose, onUnblock }) => {
  return (
    <Dialog open={open}>
      <DialogContent className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Are you sure you want to unblock this user?
        </h1>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onUnblock}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            No
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnBlockDialog