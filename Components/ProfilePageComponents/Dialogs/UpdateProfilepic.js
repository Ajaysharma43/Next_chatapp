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
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-sm mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-4">Update Profile Picture</h2>

            <input 
                type="file" 
                accept="image/*"
                onChange={onImageChange}
                className="block mx-auto mb-4 p-2 border border-gray-300 rounded-md"
            />

            {selectedImage && (
                <div className="w-36 h-36 mx-auto mb-4 rounded-full overflow-hidden border-4 border-indigo-500 relative">
                    <Image 
                        src={URL.createObjectURL(selectedImage)}  // Use Object URL to show image preview
                        alt="Selected" 
                        layout="fill"  // Makes the image take up the entire container
                        objectFit="cover"  // Ensures the image covers the entire container without stretching
                        className="absolute top-0 left-0" 
                    />
                </div>
            )}

            <div className="flex justify-between mt-4">
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleSave}
                    className="w-1/2 mr-2"
                >
                    Save
                </Button>
                <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={onClose}
                    className="w-1/2 ml-2"
                >
                    Cancel
                </Button>
            </div>
        </div>
    )
}
