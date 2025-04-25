"use client"

import { Button } from "@mui/material"
import Image from "next/image"

export const UpdateProfile = ({ onClose, userid, selectedImage, setSelectedImage, onSave }) => {

    const onImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedImage(file)  // Store the file object directly
        }
    }

    const handleSave = () => {
        const formdata = new FormData()
        formdata.append('file', selectedImage)  // Directly append the file object
        formdata.append('userid', userid)
        console.log(formdata.get('file'))  // This logs the File object
        onSave(formdata)
        onClose() 
    }

    return (
        <div className="p-4">
            <input 
                type="file" 
                accept="image/*"
                onChange={onImageChange}
                className="mb-4"
            />
            {selectedImage && (
                <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-indigo-200">
                    <Image 
                        src={URL.createObjectURL(selectedImage)}  // Use Object URL to show image preview
                        alt="Selected" 
                        fill
                        className="object-cover w-full h-full" 
                    />
                </div>
            )}

            <div className="mt-4 flex justify-center gap-4">
                <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
                <Button variant="outlined" color="secondary" onClick={onClose}>Cancel</Button>
            </div>
        </div>
    )
}
