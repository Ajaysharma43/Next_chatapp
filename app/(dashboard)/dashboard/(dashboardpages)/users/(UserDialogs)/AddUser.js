import { AuthInstance } from "@/Interseptors/AuthInterseptors";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";

export const AddUser = ({ open, onClose, HandleCreate }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    country : "",
    postal_code: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [emailStatus, setEmailStatus] = useState(null);
  const [Create , setCreateUser] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      if (typingTimeout) clearTimeout(typingTimeout);
      setTypingTimeout(setTimeout(() => EmailVerify(value), 500)); // Debounce Email Verify
    }
  };

  // Email Verification with Debounce
  const EmailVerify = async (email) => {
    if (!email) return;
  
    try {
      const res = await AuthInstance.post("/Checkuser", { email });
  
      if (res.data.success) {
        setEmailStatus("Email available");
        setCreateUser(true);
      } else {
        setEmailStatus("Email already in use");
        setCreateUser(false);
      }
    } catch (error) {
      console.error("Email verification failed:", error);
      setEmailStatus("Error checking email");
      setCreateUser(false);
    }
  };
  

  // Validate form data
  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Invalid email format";
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = "Phone number must be 10 digits";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      HandleCreate(formData);
      onClose(); // Close dialog after submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        country : "",
        postal_code: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [typingTimeout]);

  return (
    <Dialog open={open}  maxWidth="sm" fullWidth>
      <DialogTitle className="text-center text-lg font-bold">Add New User</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:border-blue-500"
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:border-blue-500"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            {emailStatus && <p className={`text-xs mt-1 ${emailStatus.includes("Error") ? "text-red-500" : "text-green-500"}`}>{emailStatus}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:border-blue-500"
            />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
          </div>

          {/* Address Fields */}
          <div>
            <label className="block text-sm font-medium">Street</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Postal Code</label>
            <input
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:border-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:border-blue-500"
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:border-blue-500"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
              Cancel
            </button>
            <button type="submit" className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-200 disabled:text-black`} disabled={Create == false}>
              Add User
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
