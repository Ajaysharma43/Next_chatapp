"use client";
import { useState, useRef } from "react";

const StepperOtpForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    country: "",
    postalCode: "",
    otp: ["", "", "", "", "", ""],
  });

  const inputRefs = useRef([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (index, e) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData({ ...formData, otp: newOtp });

    if (value && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const validateStep = () => {
    if (step === 1 && (!formData.name.trim() || !/\S+@\S+\.\S+/.test(formData.email) || !formData.phone.trim())) {
      alert("Please enter a valid Name, Email, and Phone Number!");
      return false;
    }
    if (step === 2 && (!formData.street.trim() || !formData.city.trim() || !formData.country.trim() || !formData.postalCode.trim())) {
      alert("Please complete your Address!");
      return false;
    }
    if (step === 3 && formData.otp.includes("")) {
      alert("Please enter a valid 6-digit OTP!");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-center mb-6 space-x-2 sm:space-x-4">
        {["1", "2", "3", "4"].map((num, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-white font-bold
                ${step >= index + 1 ? "bg-blue-500" : "bg-gray-300"}`}>
              {num}
            </div>
            {index < 3 && <div className="w-8 sm:w-12 h-1 bg-gray-300 mx-1 sm:mx-2"></div>}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Step 1: Personal Info</h2>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full p-3 border rounded-md mb-3"/>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-3 border rounded-md mb-3"/>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="w-full p-3 border rounded-md"/>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Step 2: Address</h2>
          <input type="text" name="street" value={formData.street} onChange={handleChange} placeholder="Street Address" className="w-full p-3 border rounded-md mb-3"/>
          <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full p-3 border rounded-md mb-3"/>
          <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" className="w-full p-3 border rounded-md mb-3"/>
          <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Postal Code" className="w-full p-3 border rounded-md"/>
        </div>
      )}

      {step === 3 && (
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Step 3: OTP Verification</h2>
          <p className="text-gray-500 mb-4">Enter the 6-digit OTP sent to your phone</p>
          <div className="flex justify-center space-x-2 sm:space-x-3 mb-6">
            {formData.otp.map((_, index) => (
              <input key={index} type="text" maxLength="1" value={formData.otp[index]} onChange={(e) => handleOtpChange(index, e)} onKeyDown={(e) => handleKeyDown(index, e)} ref={(el) => (inputRefs.current[index] = el)} className="w-10 h-10 sm:w-12 sm:h-12 text-xl text-center border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"/>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">🎉 Registration Complete!</h2>
          <p className="text-gray-700">Thank you for registering. Your details have been saved.</p>
        </div>
      )}

      <div className="mt-6 flex justify-between">
        {step > 1 && <button onClick={prevStep} className="px-4 py-2 bg-gray-400 text-white rounded-lg text-sm sm:text-base">Previous</button>}
        {step < 4 ? (
          <button onClick={nextStep} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm sm:text-base">Next</button>
        ) : (
          <button onClick={() => alert("Form Submitted Successfully!")} className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm sm:text-base">Finish</button>
        )}
      </div>
    </div>
  );
};

export default StepperOtpForm;