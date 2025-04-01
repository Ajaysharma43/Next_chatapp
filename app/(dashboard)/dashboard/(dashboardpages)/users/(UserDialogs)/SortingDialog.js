import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

export const Sorting = ({ open, onClose, handleSort }) => {
  const [formData, setFormData] = useState({
    sortBy: "name", // Default sorting criteria
    order: "asc", // Default order
    time: "", // Time input (only if "Time" is selected)
  });

  // Handle changes in sorting selection
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSort(formData); // Pass sorting data to parent component
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle className="text-center text-lg font-bold">Sort Data</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium">Sort By</label>
            <select
              name="sortBy"
              value={formData.sortBy}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="name">Name</option>
              <option value="created_at">Time</option>
              <option value="id">ID</option>
            </select>
          </div>

          {/* Order Selection */}
          <div>
            <label className="block text-sm font-medium">Order</label>
            <select
              name="order"
              value={formData.order}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="ASC">Ascending</option>
              <option value="DESC">Descending</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Apply Sort
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
