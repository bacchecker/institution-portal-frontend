import React, { Component } from "react";
import withRouter from "@components/withRouter";
import { IoMdClose } from "react-icons/io";
import axios from "@utils/axiosConfig";
import toast from "react-hot-toast";
import { FaAnglesRight } from "react-icons/fa6";
import Spinner from "@components/Spinner";
import { Input, Textarea } from "@nextui-org/react";
import AuthLayout from "@components/AuthLayout";
import Select from "@components/Select";

class InstitutionData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        name: "",
        description: "",
        address: "",
        digital_address: "",
        mailing_address: "",
        region: "",
        academic_level: "",
        institution_email: "",
        website_url: "",
        alternate_contacts: "",
        helpline_contact: "",
        logo: "",
        logoFile: null,
      },
      regionData: [
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
      ],
      academicLeveData: [
        { id: "Tertiary", name: "Tertiary" },
        { id: "Secondary", name: "Secondary" },
        { id: "Basic", name: "Basic" },
      ],
      errors: {},
      isSaving: false,
    };
  }

  componentDidMount() {
    this.fetchInstitution();
    const { institutionData } = this.props.location.state || {};
    if (institutionData) {
      this.setState({
        formData: {
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
          website_url: institutionData.website_url,
          alternate_contacts: institutionData.alternate_contacts,
          logo: institutionData.logo,
          logoFile: null,
        },
      });
    }
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [name]: value,
      },
    }));
  };

  handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        // Set the base64 string to `logo` to preview the image
        this.setState((prevState) => ({
          formData: {
            ...prevState.formData,
            logoFile: file, // Keep the actual file
            logo: reader.result, // Set base64 string for preview
          },
        }));
      };

      reader.readAsDataURL(file); // Read file as base64 string
    }
  };

  handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        // Set the base64 string to `logo` to preview the image
        this.setState((prevState) => ({
          formData: {
            ...prevState.formData,
            operationCertFile: file, // Keep the actual file
            operation_certificate: reader.result, // Set base64 string for preview
          },
        }));
      };

      reader.readAsDataURL(file); // Read file as base64 string
    }
  };

  validateForm = () => {
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
      operationCertFile,
      logo,
      operation_certificate,
    } = this.state.formData;

    let newErrors = {};
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!name) newErrors.name = "Institution Name is required";
    if (!description) newErrors.description = "Description is required";
    if (!academic_level)
      newErrors.academic_level = "Academic Level is required";
    if (!region) newErrors.region = "Region is required";
    if (!address) newErrors.address = "Address is required";
    if (!institution_email) {
      newErrors.institution_email = "Institution email is required";
    } else if (!emailPattern.test(institution_email)) {
      newErrors.institution_email = "Please enter a valid email address";
    } else if (
      institution_email.endsWith("gmail.com") ||
      institution_email.endsWith("yahoo.com")
    ) {
      newErrors.institution_email =
        "Institution email cannot be a Gmail or Yahoo address";
    }
    if (!helpline_contact)
      newErrors.helpline_contact = "Help line contact is required";
    if (!prefix) newErrors.prefix = "Prefix is required";
    if (!digital_address)
      newErrors.digital_address = "Digital address is required";
    if (!mailing_address)
      newErrors.mailing_address = "Mailing address is required";
    if (
      (!logoFile && !logo) ||
      (logoFile && logoFile.name === "default-logo.png")
    ) {
      newErrors.logoFile =
        "Institution Logo is required and cannot be default.";
    }
    if (
      (!operationCertFile && !operation_certificate) ||
      (operationCertFile &&
        operationCertFile.name === "default-operation-cert.png")
    ) {
      newErrors.operationCertFile =
        "Operation Certificate is required and cannot be default.";
    }

    this.setState({ errors: newErrors });
    return Object.keys(newErrors).length === 0;
  };

  handleSubmit = async (event) => {
    if (event) event.preventDefault();
    this.setState({ isSaving: true });

    if (!this.validateForm()) {
      this.setState({ isSaving: false });
      return false;
    }

    const form = new FormData();
    const { formData } = this.state;

    // Check if both logoFile and operation_certificate are present
    if (
      formData.logoFile &&
      formData.logoFile.name !== "default-logo.png" &&
      formData.operation_certificate &&
      formData.operationCertFile.name !== "default-operation-cert.png"
    ) {
      // Append logoFile and operation_certificate to FormData
      form.append("logo", formData.logoFile);
      form.append("operation_certificate", formData.operationCertFile);
    }

    // Append the rest of the form data
    Object.keys(formData).forEach((key) => {
      if (key !== "logoFile" && key !== "operationCertFile") {
        form.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post("/institution/account-setup", form);
      toast.success(response.data.message);
      this.props.navigate("/account-setup/document-types");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      this.setState({ isSaving: false });
      return true;
    }
  };

  fetchInstitution = async () => {
    try {
      const response = await axios.get("/institution/institution-data");
      const institutionData = response.data.institutionData;

      if (institutionData) {
        this.setState(
          {
            formData: {
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
              website_url: institutionData.website_url,
              alternate_contacts: institutionData.alternate_contacts,
              logo: institutionData.logo,
              operation_certificate: institutionData.operation_certificate,
              logoFile: null,
              operationCertFile: null,
            },
          },
          () => {
            this.setState({
              disable_name: !!this.state.formData.name,
              disable_prefix: !!this.state.formData.prefix,
              disable_institution_email:
                !!this.state.formData.institution_email,
              disable_helpline_contact: !!this.state.formData.helpline_contact,
              disable_address: !!this.state.formData.address,
              disable_digital_address: !!this.state.formData.digital_address,
              disable_description: !!this.state.formData.description,
              disable_mailing_address: !!this.state.formData.mailing_address,
              disable_region: !!this.state.formData.region,
              disable_academic_level: !!this.state.formData.academic_level,
              disable_logo: !!this.state.formData.logo,
              disable_cert: !!this.state.formData.operation_certificate,
            });
          }
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch institution data"
      );
    }
  };

  render() {
    const { formData, errors, academicLeveData, regionData, isSaving } =
      this.state;
    const defaultLogoUrl = `${
      import.meta.env.VITE_BASE_URL
    }/public/images/profile/default-logo.png`;

    const defaultOperationCertUrl = `${
      import.meta.env.VITE_BASE_URL
    }/public/images/profile/default-operation-cert.png`;

    return (
      <div className="w-full flex justify-center py-8">
        <div className="w-full flex flex-col bg-white dark:bg-slate-900 rounded-md md:px-3 border border-[#ff0404]">
          <div className="mx-auto my-6 px-4 w-full">
            <div>
              <p className="text-gray-500 text-lg">Let's get started</p>
              <p className="text-2xl font-bold my-2 text-[#ff0404]">
                Complete your account setup
              </p>
              <p className="font-medium text-gray-700 text-sm">
                Every Institution is unique, we want to know about yours. <br />
                Make sure the information you submitted during registration is
                your exact institutional details.
              </p>
            </div>
            <form
              onSubmit={this.handleSubmit}
              className="flex flex-col space-y-6 mt-10"
            >
              <div className="flex flex-col xl:flex-row xl:space-x-4 space-y-4 xl:space-y-0">
                <Input
                  label="Institution Name"
                  name="name"
                  value={formData.name}
                  onChange={this.handleInputChange}
                  disabled={this.state.disable_name}
                  isInvalid={errors.name}
                  errorMessage={errors.name}
                  className="xl:w-[80%]"
                />
                <Input
                  label="Institution Prefix"
                  name="prefix"
                  value={formData.prefix}
                  onChange={this.handleInputChange}
                  disabled={this.state.disable_prefix}
                  isInvalid={errors.prefix}
                  errorMessage={errors.prefix}
                  className="flex-1"
                />
              </div>
              <div className="flex flex-col xl:flex-row xl:space-x-4 space-y-4 xl:space-y-0">
                <div className="flex-1">
                  <Input
                    label="Institution Email"
                    name="institution_email"
                    value={formData.institution_email}
                    disabled={this.state.disable_institution_email}
                    onChange={this.handleInputChange}
                    isInvalid={errors.institution_email}
                    errorMessage={errors.institution_email}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label="Help Line Contact"
                    name="helpline_contact"
                    disabled={this.state.disable_helpline_contact}
                    value={formData.helpline_contact}
                    onChange={this.handleInputChange}
                    isInvalid={errors.helpline_contact}
                    errorMessage={errors.helpline_contact}
                  />
                </div>
              </div>
              <div className="flex-1 pb-3">
                <Textarea
                  label="Description"
                  name="description"
                  value={formData.description}
                  disabled={this.state.disable_description}
                  onChange={this.handleInputChange}
                  isInvalid={errors.description}
                  errorMessage={errors.description}
                />
              </div>

              <div className="flex flex-col xl:flex-row xl:space-x-4 space-y-10 xl:space-y-0">
                <Select
                  label="Academic Level"
                  name="academic_level"
                  value={formData.academic_level}
                  itemNameKey="name"
                  menuItems={academicLeveData}
                  onChange={this.handleInputChange}
                  disabled={this.state.disable_academic_level}
                  error_message={errors.academic_level}
                />
                <Select
                  label="Select Region"
                  name="region"
                  value={formData.region}
                  itemNameKey="name"
                  menuItems={regionData}
                  onChange={this.handleInputChange}
                  disabled={this.state.disable_region}
                  error_message={errors.region}
                />
              </div>

              <div className="flex flex-col xl:flex-row xl:space-x-4 space-y-8 xl:space-y-0">
                <div className="flex-1">
                  <Input
                    label="Address"
                    name="address"
                    disabled={this.state.disable_address}
                    value={formData.address}
                    onChange={this.handleInputChange}
                    isInvalid={errors.address}
                    errorMessage={errors.address}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label="Digital Address"
                    name="digital_address"
                    disabled={this.state.disable_digital_address}
                    value={formData.digital_address}
                    onChange={this.handleInputChange}
                    isInvalid={errors.digital_address}
                    errorMessage={errors.digital_address}
                  />
                </div>
              </div>
              <div className="flex flex-col xl:flex-row xl:space-x-4 space-y-8 xl:space-y-0">
                <div className="flex-1">
                  <Input
                    label="Institution Website URL"
                    name="website_url"
                    value={formData.website_url}
                    onChange={this.handleInputChange}
                    isInvalid={errors.website_url}
                    errorMessage={errors.website_url}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label="Post Office Mail Address"
                    name="mailing_address"
                    value={formData.mailing_address}
                    onChange={this.handleInputChange}
                    isInvalid={errors.mailing_address}
                    errorMessage={errors.mailing_address}
                  />
                </div>
              </div>

              <div className="">
                <Input
                  label="Other Contacts"
                  name="alternate_contacts"
                  value={formData.alternate_contacts}
                  onChange={this.handleInputChange}
                  caption="Note: Use commas (,) to seperate different numbers"
                  isInvalid={errors.alternate_contacts}
                  errorMessage={errors.alternate_contacts}
                />
              </div>

              <div className="flex xl:flex-row space-x-4">
                <div className="space-y-6">
                  <div className="space-y-3 flex flex-col w-full">
                    <label htmlFor="logo" className="form-label">
                      Institution Logo
                    </label>
                    <input
                      id="logo"
                      type="file"
                      accept="image/*"
                      disabled={this.state.disable_logo}
                      onChange={this.handleImageChange}
                    />
                    {this.state.errors.logoFile && (
                      <span className="text-red-600 text-sm">
                        {this.state.errors.logoFile}
                      </span>
                    )}
                  </div>

                  <div className="relative flex items-center justify-center w-auto group border">
                    <img
                      className="w-36 h-36"
                      src={
                        this.state.formData.logo
                          ? `https://backend.baccheck.online/storage/app/public/${this.state.formData.logo}`
                          : this.state.formData.logoFile
                          ? `${
                              import.meta.env.VITE_BASE_URL
                            }/storage/app/public/${
                              this.state.formData.logoFile
                            }`
                          : defaultLogoUrl
                      }
                      alt="Institution Logo"
                    />

                    <div
                      className="absolute cursor-pointer opacity-0 group-hover:opacity-100 inset-0 bg-white/50 text-gray-600 grid place-items-center"
                      onClick={() =>
                        this.setState((prevState) => ({
                          formData: { ...prevState.formData, logo: null },
                        }))
                      }
                    >
                      <IoMdClose size={25} />
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-6">
                  <div className="space-y-3 flex flex-col w-full">
                    <label htmlFor="operationCert" className="form-label">
                      Operation Certificate
                    </label>
                    <input
                      id="operationCert"
                      type="file"
                      accept="image/*"
                      disabled={this.state.disable_operationCert}
                      onChange={this.handleFileChange}
                    />
                    {this.state.errors.operationCertFile && (
                      <span className="text-red-600 text-sm">
                        {this.state.errors.operationCertFile}
                      </span>
                    )}
                  </div>

                  <div className="relative flex items-center justify-center max-h-36 w-full group border">
                    <img
                      src={
                        this.state.formData.operation_certificate
                          ? `https://backend.baccheck.online/storage/app/public/${this.state.formData.operation_certificate}`
                          : this.state.formData.operationCertFile
                          ? `${
                              import.meta.env.VITE_BASE_URL
                            }/storage/app/public/${
                              this.state.formData.operationCertFile
                            }`
                          : defaultOperationCertUrl
                      }
                      alt="Institution Operation Certificate"
                    />

                    <div
                      className="absolute cursor-pointer opacity-0 group-hover:opacity-100 inset-0 bg-white/50 text-gray-600 grid place-items-center"
                      onClick={() =>
                        this.setState((prevState) => ({
                          formData: {
                            ...prevState.formData,
                            operationCert: null,
                          },
                        }))
                      }
                    >
                      <IoMdClose size={25} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`flex items-center bg-[#ff0404] hover:bg-[#ff0404] text-white px-4 py-1.5 rounded-md font-medium ${
                    isSaving ? "cursor-not-allowed bg-gray-400" : ""
                  }`}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Spinner size="w-5 h-5" />
                      <span className="ml-2">Saving...</span>
                    </>
                  ) : (
                    <>
                      Save and Continue
                      <FaAnglesRight className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(InstitutionData);
