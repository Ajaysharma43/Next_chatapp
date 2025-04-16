"use client"
import socket from "@/app/SocketConnection/SocketConnection";
import { Dialog, DialogContent, DialogActions, Button, Typography } from "@mui/material";

const DeleteMessageDialog = ({ open, onClose, message }) => {

    const HandleDeleteMessage = () => {
        let messages = message
        socket.emit('DeleteGroupMessage' , messages)
        onClose()
    }
    return (
        <Dialog open={open}>
            <DialogContent>
                <Typography>Are you sure you want to delete this message?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button color="error" onClick={HandleDeleteMessage}>Delete</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteMessageDialog;
