"use client";

import { useState } from "react";
const { CreateGroupDialog } = require("./Dialogs/CreateGroupDialog");

const CreateChatGroup = () => {
    const [createDialog, setCreateDialog] = useState(false);

    const handleOpen = () => setCreateDialog(true);
    const handleClose = () => setCreateDialog(false);

    return (
        <>
            <CreateGroupDialog open={createDialog} onClose={handleClose} />
            <button
                onClick={handleOpen}
                className="bg-gradient-to-r from-amber-400 to-amber-600 rounded-lg p-2 uppercase text-white"
            >
                Create Chat Group
            </button>
        </>
    );
};

export default CreateChatGroup;
