"use client"

import { Dialog, DialogActions, DialogContent } from "@mui/material"

export const DeleteCommentDialog = ({open , onclose , onDelete}) => {
    return (
        <>
        <Dialog open={open}>
            <DialogContent>
                <h1 className="capitalize">do you really want to delete this comment?</h1>
            </DialogContent>

            <DialogActions>
                <button className="text-white uppercase bg-amber-400 rounded-lg p-2 transition-all duration-200 hover:bg-amber-500" onClick={() => onDelete()}>Yes</button>
                <button onClick={onclose} className="text-white uppercase bg-gray-400 rounded-lg p-2 transition-all duration-200 hover:bg-gray-500">No</button>
            </DialogActions>
        </Dialog>
        </>
    )
}