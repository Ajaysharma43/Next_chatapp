"use client"
import { HidePost } from "@/Redux/features/UserProfileSlice"
import { Dialog, DialogContent, DialogActions } from "@mui/material"

const HidePostDialog = ({ open, onClose, dispatch, imageid, closeDrawer }) => {
    return (
        <>
            <Dialog open={open}>
                <DialogContent>
                    <h1>are you sure you really want to hide the post</h1>
                </DialogContent>
                <DialogActions>
                    <button onClick={() => {
                        dispatch(HidePost({ imageid: imageid }))
                        onClose()
                        closeDrawer()
                    }}>
                        Yes
                    </button>
                    <button onClick={onClose}>
                        No
                    </button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default HidePostDialog