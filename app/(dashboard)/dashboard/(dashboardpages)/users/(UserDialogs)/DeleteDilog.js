import { Dialog, DialogContent } from "@mui/material";

export const DeleteUser = ({ open, onClose, id, handleDelete }) => {
  return (
    <Dialog open={open}>
      <DialogContent>
        <div className="p-6 text-center space-y-4">
          <h1 className="text-lg font-semibold text-gray-800">
            Are you sure you really want to delete this user?
          </h1>
          <div className="flex justify-center gap-4 mt-4">
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
              onClick={() => handleDelete(id)}
            >
              Yes, Delete
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-300"
              onClick={() => onClose(id)}
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};