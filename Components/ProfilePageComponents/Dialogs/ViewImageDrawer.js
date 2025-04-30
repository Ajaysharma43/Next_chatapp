"use client"
import { Dialog, IconButton } from "@mui/material";
import Image from "next/image";
import { IoClose } from "react-icons/io5";

const ViewImage = ({ open, onclose, image }) => {
    return (
        <Dialog
            open={open}
            onClose={onclose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                className: "bg-black relative rounded-lg overflow-hidden",
            }}
        >
            {/* Close button */}
            <IconButton
                onClick={onclose}
                className="absolute top-2 right-2 z-10 text-white bg-black bg-opacity-50 hover:bg-opacity-75"
            >
                <IoClose className="text-2xl" />
            </IconButton>

            {/* Image Container */}
            <div className="relative w-full h-[70vh] bg-black">
                <Image
                    src={image}
                    alt="No image"
                    layout="fill"
                    objectFit="contain"
                    className="rounded-lg"
                />
            </div>
        </Dialog>
    );
};

export default ViewImage;
