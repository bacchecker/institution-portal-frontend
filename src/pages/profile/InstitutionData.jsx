import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useLocation } from "react-router-dom";
import Textbox from "../../components/Textbox";
import Textarea from "../../components/Textarea";
import Select from "../../components/Select";
import { IoMdClose } from "react-icons/io";
import axios from "../../axiosConfig";
import toast from "react-hot-toast";

const InstitutionData = forwardRef((props, ref) => {
  const location = useLocation();
  const { onSavingChange } = props;
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    digital_address: "",
    mailing_address: "",
    region: "",
    academic_level: "",
    institution_email: "",
    helpline_contact: "",
    logo: "",
    logoFile: null,
  });

  const [regionData] = useState([
    { id: "Ahafo", name: "Ahafo" },
    { id: "Ashanti", name: "Ashanti" },
    { id: "Bono East", name: "Bono East" },
    { id: "Brong Ahafo", name: "Brong Ahafo" },
    { id: "Central", name: "Central" },
    { id: "Eastern", name: "Eastern" },
    { id: "Greater Accra", name: "Greater Accra" },
    { id: "North East", name: "North East" },
    { id: "Northern Oti", name: "Northern Oti" },
    { id: "Oti", name: "Oti" },
    { id: "Savannah", name: "Savannah" },
    { id: "Upper East", name: "Upper East" },
    { id: "Upper West", name: "Upper West" },
    { id: "Volta", name: "Volta" },
    { id: "Western", name: "Western" },
    { id: "Western North", name: "Western North" },
  ]);

  const [academicLeveData] = useState([
    { id: "Tertiary", name: "Tertiary" },
    { id: "Secondary", name: "Secondary" },
    { id: "Basic", name: "Basic" },
  ]);
  
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle image change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevState) => ({
          ...prevState,
          logo: reader.result,
          logoFile: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const {
      name,
      description,
      academic_level,
      region,
      address,
      institution_email,
      helpline_contact,
      prefix,
      digital_address,
      mailing_address,
      logoFile,
    } = formData;
    let newErrors = {};
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!name) newErrors.name = "Institution Name is required";
    if (!description) newErrors.description = "Description is required";
    if (!academic_level) newErrors.academic_level = "Academic Level is required";
    if (!region) newErrors.region = "Region is required";
    if (!address) newErrors.address = "Address is required";
    if (!institution_email) {
      newErrors.institution_email = "Institution email is required";
    } else if (!emailPattern.test(institution_email)) {
        newErrors.institution_email = "Please enter a valid email address";
    }
    if (!helpline_contact) newErrors.helpline_contact = "Help line contact is required";
    if (!prefix) newErrors.prefix = "Prefix is required";
    if (!digital_address) newErrors.digital_address = "Digital address is required";
    if (!mailing_address) newErrors.mailing_address = "Mailing address is required";
    if (!logoFile || logoFile.name === "default-logo.png") {
      newErrors.logoFile = "Institution Logo is required and cannot be default.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
      setIsSaving(true); // Set isSaving to true
      onSavingChange(true);

    if (!validateForm()) {
      setIsSaving(false);
      onSavingChange(false);
      return false;
    }

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "logoFile" && formData.logoFile && formData.logoFile.name !== "default-logo.png") {
        form.append("logo", formData.logoFile);
      } else {
        form.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post("/institution/account-setup", form);
      toast.success(response.data.message);
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsSaving(false);
      onSavingChange(false);
      return true
    }
  };


  // Set form data from props if available
  useEffect(() => {
    const { institutionData } = location.state || {};
    if (institutionData) {
      setFormData({
        name: institutionData.name,
        address: institutionData.address,
        institution_email: institutionData.institution_email,
        helpline_contact: institutionData.helpline_contact,
        prefix: institutionData.prefix,
        description: institutionData.description,
        digital_address: institutionData.digital_address,
        mailing_address: institutionData.mailing_address,
        region: institutionData.region,
        academic_level: institutionData.academic_level,
        logo: institutionData.logo,
        logoFile: null,
      });
    }
  }, [location.state]);

  const fetchInstitution = async () => {
    try {
      const response = await axios.get('/institution/institution-data');
      const institutionData = response.data.institutionData;

      if (institutionData) {
        setFormData({
          name: institutionData.name,
          address: institutionData.address,
          institution_email: institutionData.institution_email,
          helpline_contact: institutionData.helpline_contact,
          prefix: institutionData.prefix,
          description: institutionData.description,
          digital_address: institutionData.digital_address,
          mailing_address: institutionData.mailing_address,
          region: institutionData.region,
          academic_level: institutionData.academic_level,
          logo: institutionData.logo,
          logoFile: null,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch institution data');
    }
  };

  useEffect(() => {
    fetchInstitution();
  }, []);



  // Expose handleSubmit using useImperativeHandle
  useImperativeHandle(ref, () => ({
    submitForm: handleSubmit,
  }));
  
  const defaultLogoUrl = `${import.meta.env.VITE_BASE_URL}/images/profile/default-logo.png`;
  return (
    <div className="w-full flex flex-col bg-white">
      <div className="mx-auto my-6 px-4 w-full md:w-4/5">
        <div>
          <p className="text-gray-500 text-lg">Let's get started</p>
          <p className="text-2xl font-bold my-2">Complete your account setup</p>
          <p className="font-medium text-gray-700 text-sm">
            Every Institution is unique, we want to know about yours. <br />
            Make sure the information you submitted during registration is
            your exact institutional details.
          </p>
        </div>
        <form className="flex-col space-y-6 mt-10">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
            <div className="col-span-1 xl:col-span-4">
              <Textbox
                label="Institution Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error_message={errors.name}
              />
            </div>
            <div className="col-span-1">
              <Textbox
                label="Institution Prefix"
                name="prefix"
                value={formData.prefix}
                onChange={handleInputChange}
                error_message={errors.prefix}
              />
            </div>
          </div>

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            error_message={errors.description}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Textbox
              label="Institution Email"
              name="institution_email"
              value={formData.institution_email}
              onChange={handleInputChange}
              error_message={errors.institution_email}
            />
            <Textbox
              label="Help Line Contact"
              name="helpline_contact"
              value={formData.helpline_contact}
              onChange={handleInputChange}
              error_message={errors.helpline_contact}
            />
            <Select
              label="Academic Level"
              name="academic_level"
              value={formData.academic_level}
              itemNameKey="name"
              menuItems={academicLeveData}
              onChange={handleInputChange}
              error_message={errors.academic_level}
            />
            <Select
              label="Select Region"
              name="region"
              value={formData.region}
              itemNameKey="name"
              menuItems={regionData}
              onChange={handleInputChange}
              error_message={errors.region}
            />
            <Textbox
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              error_message={errors.address}
            />
            <Textbox
              label="Digital Address"
              name="digital_address"
              value={formData.digital_address}
              onChange={handleInputChange}
              error_message={errors.digital_address}
            />
            <Textbox className='col-span-2'
              label="Post Office Mail Address"
              name="mailing_address"
              value={formData.mailing_address}
              onChange={handleInputChange}
              error_message={errors.mailing_address}
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-3 flex flex-col w-full">
              <label htmlFor="logo" className="form-label">
                Institution Logo
              </label>
              <input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {errors.logoFile && (
                <span className="text-red-600 text-sm">{errors.logoFile}</span>
              )}
            </div>

            <div className="relative h-32 w-32 group">
              <img
              src={
                formData.logo 
                  ? formData.logo  
                  :  defaultLogoUrl
              }
               
              />
              <div
                className="absolute cursor-pointer opacity-0 group-hover:opacity-100 inset-0 bg-white/50 text-gray-600 grid place-items-center"
                onClick={() => setFormData((prevState) => ({ ...prevState, logo: null }))}
              >
                <IoMdClose size={25} />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
});

export default InstitutionData;
