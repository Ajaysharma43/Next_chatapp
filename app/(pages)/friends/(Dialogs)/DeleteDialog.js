import { Dialog, DialogContent } from "@mui/material";

export const DeleteDialog = ({ open, onclose, friend, onDelete }) => {
  if (!friend) return null;

  const friendName = friend.sender_name || friend.receiver_name;

  return (
    <Dialog open={open} onClose={onclose}>
      <DialogContent>
        <article className="flex flex-col items-center justify-center p-4">
          <section className="text-center mb-4">
            <h1 className="text-xl font-semibold text-gray-800 mb-2">
              Delete Friend
            </h1>
            <p className="text-gray-600">
              Are you sure you want to remove{" "}
              <span className="font-bold text-red-500">{friendName}</span> from
              your friend list?
            </p>
          </section>

          <section className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => onDelete(friend)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-sm transition duration-200"
            >
              Delete
            </button>
            <button
              onClick={onclose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md shadow-sm transition duration-200"
            >
              Cancel
            </button>
          </section>
        </article>
      </DialogContent>
    </Dialog>
  );
};
