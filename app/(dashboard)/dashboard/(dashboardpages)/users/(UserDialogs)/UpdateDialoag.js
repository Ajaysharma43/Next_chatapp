"use client";
import { Dialog, DialogContent, DialogTitle, TextField, Button, InputLabel, Select, MenuItem } from "@mui/material";

export const UpdateDialog = ({ open, onClose, formData, handleChange, handleSubmit }) => {
  return (
    <Dialog open={open} >
      <DialogTitle>Update User</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Postal Code"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            fullWidth
          />
          <InputLabel>Role</InputLabel>
          <Select
            name="roles"
            value={formData.roles}
            onChange={handleChange}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </Select>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};