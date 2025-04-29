"use client";

import Image from "next/image";
import { useState } from "react";

const UploadUserPost = ({userid , username}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [postDescription, setPostDescription] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const HandleSubmit = () => {
    const formdata = new FormData();
    formdata.append('file' , selectedImage)
    formdata.append('id' , userid)
    formdata.append('name' , username)
    formdata.append('description' , postDescription)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full space-y-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Upload New Post
        </h2>

        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0
              file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100 cursor-pointer"
          />
          {selectedImage && (
            <Image
              src={selectedImage}
              alt="Selected"
              fill
              className="mt-4 rounded-md max-h-64 w-full object-cover"
            />
          )}
        </div>

        {/* Description Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            rows="4"
            value={postDescription}
            onChange={(e) => setPostDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write something about this post..."
          />
        </div>

        {/* Upload Button */}
        <button
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          onClick={HandleSubmit}
        >
          Upload Post
        </button>
      </div>
    </div>
  );
};

export default UploadUserPost;
