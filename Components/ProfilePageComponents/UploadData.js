"use client";

import { PostUpload } from "@/Redux/features/UserProfileSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const UploadUserPost = ({ userid, username }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [postDescription, setPostDescription] = useState("");
  const UploadStatus = useSelector((state) => state.UserProfileSlice.PostUploadStatus);
  const UploadLoading = useSelector((state) => state.UserProfileSlice.PostUploadLoading);
  const dispatch = useDispatch();
  const router = useRouter()

  useEffect(() => {
    if (UploadStatus === "success") {
      alert("Post uploaded successfully!");
      setSelectedImage(null);
      setPostDescription("");
      router.push('/profile')
    } else if (UploadStatus === "failed") {
      alert("Failed to upload post. Please try again.");
    }
  }, [UploadStatus]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const HandleSubmit = () => {
    if (!selectedImage || !postDescription.trim()) {
      alert("Please select an image and add a description.");
      return;
    }

    const formdata = new FormData();
    formdata.append("file", selectedImage);
    formdata.append("id", userid);
    formdata.append("name", username);
    formdata.append("description", postDescription);
    dispatch(PostUpload({ formdata }));
  };

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
            <div className="relative w-full h-64 mt-4 rounded-md overflow-hidden">
              <Image
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
                fill
                className="object-cover"
              />
            </div>
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
          disabled={UploadLoading}
          className={`w-full py-2 px-4 text-white rounded-lg transition duration-200 ${
            UploadLoading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={HandleSubmit}
        >
          {UploadLoading ? "Uploading..." : "Upload Post"}
        </button>
      </div>
    </div>
  );
};

export default UploadUserPost;
