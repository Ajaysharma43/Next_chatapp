import { SwipeableDrawer } from "@mui/material";

export const CommentsDrawer = ({ open, onClose, comments }) => {
    return (
        <SwipeableDrawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            onOpen={() => {}}  // Required by MUI
            PaperProps={{
                className: "rounded-t-2xl",  // Smooth rounded top corners
            }}
        >
            {/* Puller */}
            <div className="w-full flex justify-center py-2">
                <div className="w-12 h-1.5 bg-gray-400 rounded-full" />
            </div>

            {/* Content */}
            <div className="p-4">
                <h1 className="text-lg font-bold mb-4">Comments</h1>
                {comments && comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div key={index} className="border-b py-2">
                            {comment}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No comments yet.</p>
                )}
            </div>
        </SwipeableDrawer>
    );
};
