import { DeletePost } from "@/Redux/features/UserProfileSlice";
import { Dialog, DialogActions, DialogContent } from "@mui/material";

const DeleteUserPost = ({ open, onClose, dispatch, imageid, userid, imageurl, closeDrawer }) => {
    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ className: "rounded-xl p-4" }}>
            <DialogContent>
                <h1 className="text-lg font-semibold text-center text-gray-800">
                    Do you really want to delete your post?
                </h1>
            </DialogContent>

            <DialogActions className="flex justify-center gap-4 pb-4">
                <button
                    onClick={() => {
                        dispatch(DeletePost({ imageurl: imageurl, userid: userid, imageid: imageid }))
                        onClose()
                        closeDrawer();
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded-lg transition"
                >
                    Yes
                </button>

                <button
                    onClick={onClose}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-6 py-2 rounded-lg transition"
                >
                    No
                </button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteUserPost;
