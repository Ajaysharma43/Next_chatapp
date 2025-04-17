import { Dialog, DialogContent } from "@mui/material";

export const BlockDialog = ({ open, onclose, friend, onBlock  }) => {
  return (
    <Dialog open={open} onClose={onclose}>
      <DialogContent>
        <div className="grid gap-4">
          <h1 className="text-lg font-semibold">
            Do you really want to block{" "}
            <span className="font-bold">
              {friend?.sender_name || friend?.receiver_name}?
            </span>
          </h1>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => onBlock(friend)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
            >
              Yes
            </button>
            <button
              onClick={onclose}
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-1 rounded"
            >
              No
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
