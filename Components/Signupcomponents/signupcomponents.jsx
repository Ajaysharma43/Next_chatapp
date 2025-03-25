"use client";
import { useState, useRef, useEffect } from "react";
import { AuthInstance } from "@/Interseptors/AuthInterseptors";
import Cookies from "js-cookie";

const StepperOtpForm = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
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
  const [emailValidationMessage, setEmailValidationMessage] = useState("");
  const [ValidEmail, setValidEmail] = useState(false);
  const debounceTimeout = useRef(null);
  const inputRefs = useRef([]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "email") {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        validateEmailFromBackend(e.target.value);
      }, 500);
    }
  };

  // Validate email from backend
  const validateEmailFromBackend = async (email) => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailValidationMessage("❌ Invalid email format");
      setValidEmail(false);
      return;
    }

    try {
      const response = await AuthInstance.post("/Checkuser", { email });

      if (response.data.success === true) {
        setValidEmail(true);
        setEmailValidationMessage("✅ Email is available");
      } else {
        setValidEmail(false);
        setEmailValidationMessage("❌ Email already in use");
      }
    } catch (error) {
      console.error("Error validating email:", error);
      setEmailValidationMessage("⚠️ Error validating email");
      setValidEmail(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index, e) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData({ ...formData, otp: newOtp });

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    } else if (index === 5 && newOtp.every((digit) => digit !== "")) {
      submitOtp(newOtp.join(""));
    }
  };

  // Handle backspace for OTP input navigation
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Validate current step before proceeding
  const validateStep = () => {
    if (
      step === 1 &&
      (!formData.name.trim() ||
        !/\S+@\S+\.\S+/.test(formData.email) ||
        !formData.street.trim() ||
        !formData.city.trim() ||
        !formData.country.trim() ||
        !formData.postalCode.trim())
    ) {
      alert("Please enter valid details!");
      return false;
    }
    if (step === 2 && !formData.phone.trim()) {
      alert("Please enter your Phone Number!");
      return false;
    }
    if (step === 3 && formData.otp.includes("")) {
      alert("Please enter a valid 6-digit OTP!");
      return false;
    }
    return true;
  };

  const submitOtp = async (otp) => {
    setIsLoading(true);

    try {
      const hashedOTP = Cookies.get("OTP");
      const response = await AuthInstance.post("/VerifyOtp", {
        OTP: hashedOTP,
        otp,
      });

      if (response.data.success == true) {
        const res = await AuthInstance.post('/Signup' , {formData})
        if(res.data.success == true)
        {
            setTimeout(() => {
                setStep(step + 1);
                setIsLoading(false);
            }, 2000);
        }
        else
        {
            alert("error while creating user")
        }
      } else {
        alert("❌ Invalid OTP. Please try again.");
        setFormData({ ...formData, otp: ["", "", "", "", "", ""] });
        inputRefs.current[0].focus();
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("⚠️ OTP verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Go to next step
  const nextStep = () => {
    if (validateStep()) {
      setIsLoading(true);
      setTimeout(() => {
        setStep(step + 1);
        setIsLoading(false);
      }, 1500);
    }
  };

  const GenerateOtp = async () => {
    try {
      if (formData.phone.length == 10) {
        const res = await AuthInstance.post("/OTPgenerate", {
          Number: formData.phone,
        });
        if (res.data.success == true) {
          Cookies.set("OTP", res.data.OTP);
          // , { expires: 1 / 1440 }
          setStep(step + 1);
        }
      } else {
        alert("enter a valid 10 digit phone Number");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Go to previous step
  const prevStep = () => setStep(step - 1);

  return (
    <div className="relative max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      {/* Backdrop Loader */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-10">
          <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        </div>
      )}

      {/* Stepper Indicator */}
      <div className="flex justify-center mb-6 space-x-4">
        {["1", "2", "3", "4"].map((num, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold ${
                step >= index + 1 ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              {num}
            </div>
            {index < 3 && <div className="w-12 h-1 bg-gray-300 mx-2"></div>}
          </div>
        ))}
      </div>

      {/* Step 1: Personal Info */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Step 1: Personal Info</h2>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-3 border rounded-md mb-3"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border rounded-md mb-1"
          />
          {emailValidationMessage && (
            <p className="text-sm mt-1 text-red-500">
              {emailValidationMessage}
            </p>
          )}
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="Street"
            className="w-full p-3 border rounded-md mb-3"
          />
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="w-full p-3 border rounded-md mb-3"
          />
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
            className="w-full p-3 border rounded-md mb-3"
          />
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="Postal Code"
            className="w-full p-3 border rounded-md mb-3"
          />
        </div>
      )}

      {/* Step 2: Phone Number */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Step 2: Phone Number</h2>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full p-3 border rounded-md"
          />
          <div className="flex justify-end relative top-[65px]">
            <button
              onClick={GenerateOtp}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Generate OTP
            </button>
          </div>
        </div>
      )}

      {/* Step 3: OTP Verification */}
      {step === 3 && (
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">
            Step 3: OTP Verification
          </h2>
          <div className="flex justify-center space-x-2 mb-6">
            {formData.otp.map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={formData.otp[index]}
                onChange={(e) => handleOtpChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-10 h-10 text-xl text-center border rounded-md"
              />
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="flex items-center justify-center">
          <div className="rounded-lg p-6 max-w-md text-center">
            <h2 className="text-2xl font-semibold text-green-600 mb-2">
              🎉 Signup Successful!
            </h2>
            <p className="text-gray-700 mb-4">
              Thank you for signing up. Your account has been created
              successfully.
            </p>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              Go to Login
            </button>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-between">
        {step > 1 && (
          <button
            onClick={prevStep}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg"
          >
            Previous
          </button>
        )}
        <button
          onClick={nextStep}
          disabled={isLoading || !ValidEmail}
          className={`px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 ${
            step == 2 ? "hidden" : "block"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StepperOtpForm;
