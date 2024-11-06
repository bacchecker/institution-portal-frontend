import React, { useEffect, useState } from "react";
import useSWR from "swr";
import axios from "@utils/axiosConfig";
import { Input, Spinner, Textarea, user } from "@nextui-org/react";
import { FaAnglesRight } from "react-icons/fa6";
import secureLocalStorage from "react-secure-storage";
import { toast } from "sonner";
import { IoDocumentText } from "react-icons/io5";
import Swal from "sweetalert2";

function InstitutionDataSetup({ setActiveStep }) {
  const [userInput, setUserInput] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const institution = secureLocalStorage.getItem("institution");
  const setInstitution = (newInstitution) => {
    secureLocalStorage.setItem("institution", newInstitution);
  };

  const {
    data: institutionData,
    error,
    isLoading,
  } = useSWR("/institution/institution-data", (url) =>
    axios.get(url).then((res) => res.data)
  );

  useEffect(() => {
    if (institutionData) {
      setUserInput(institutionData?.institutionData.institution);
    }
  }, [institutionData]);

  const handleUserInput = (e) => {
    setUserInput((userInput) => ({
      ...userInput,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const {
      name,
      description,
      academic_level,
      region,
      address,
      institution_email,
      website_url,
      helpline_contact,
      prefix,
      digital_address,
      mailing_address,
      operation_certificate,
    } = userInput;

    if (!operation_certificate && !selectedCert) {
      toast.error("Operation Certificate is required");
      setIsSaving(false);
    } else {
      const form = new FormData();

      form.append("name", name);
      form.append("address", address);
      form.append("description", description);
      academic_level && form.append("academic_level", academic_level);
      form.append("region", region);
      form.append("website_url", website_url);
      form.append("institution_email", institution_email);
      form.append("helpline_contact", helpline_contact);
      form.append("prefix", prefix);
      form.append("digital_address", digital_address);
      form.append("mailing_address", mailing_address);
      selectedImage && form.append("logo", selectedImage);
      selectedCert && form.append("operation_certificate", selectedCert);
      try {
        const response = await axios.post("/institution/account-setup", form);
        Swal.fire({
          title: "Success",
          text: response.data.message,
          icon: "success",
          button: "OK",
          confirmButtonColor: "#00b17d",
        }).then((isOkay) => {
          if (isOkay) {
            const updatedInstitution = {
              ...institution,
              current_step: "2",
            };
            setInstitution(updatedInstitution);
            secureLocalStorage.setItem("institution", updatedInstitution);
            setActiveStep(2);
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message,
          icon: "error",
          button: "OK",
        });
        setIsSaving(false);
      } finally {
        setIsSaving(false);
        return true;
      }
    }
  };

  return (
    <div className="mx-auto my-6 px-4 w-full">
      <div>
        <p className="text-gray-500 text-lg">Let's get started</p>
        <p className="text-2xl font-bold my-2 text-[#ff0404]">
          Complete your account setup
        </p>
        <p className="font-medium text-gray-700 text-sm">
          Every Institution is unique, we want to know about yours. <br />
          Make sure the information you submitted during registration is your
          exact institutional details.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6 mt-10">
        <div className="flex flex-col xl:flex-row xl:space-x-4 space-y-4 xl:space-y-0">
          <Input
            label="Institution Name"
            name="name"
            value={userInput.name}
            disabled={true}
            className="xl:w-[80%]"
          />
          <Input
            label="Institution Prefix"
            name="prefix"
            value={userInput.prefix}
            disabled={true}
            className="flex-1"
          />
        </div>
        <div className="flex flex-col xl:flex-row xl:space-x-4 space-y-4 xl:space-y-0">
          <div className="flex-1">
            <Input
              label={
                <>
                  Institution Email<span className="text-[#ff0404]">*</span>
                </>
              }
              name="institution_email"
              value={userInput.institution_email}
              onChange={handleUserInput}
              required
            />
          </div>
          <div className="flex-1">
            <Input
              label={
                <>
                  Help Line Contact<span className="text-[#ff0404]">*</span>
                </>
              }
              name="helpline_contact"
              value={userInput.helpline_contact}
              onChange={handleUserInput}
            />
          </div>
        </div>
        <div className="flex-1 pb-3">
          <Textarea
            label={
              <>
                Description<span className="text-[#ff0404]">*</span>
              </>
            }
            name="description"
            value={userInput.description}
            onChange={handleUserInput}
            required
          />
        </div>

        <div className="flex flex-col xl:flex-row xl:space-x-4 space-y-10 xl:space-y-0">
          {userInput?.type === "bacchecker-academic" && (
            <Input
              label="Academic Level"
              name="academic_level"
              value={userInput.academic_level}
              disabled={true}
            />
          )}
          <Input
            label="Region"
            name="region"
            value={userInput.region}
            disabled={true}
          />
        </div>

        <div className="flex flex-col xl:flex-row xl:space-x-4 space-y-8 xl:space-y-0">
          <div className="flex-1">
            <Input
              label="Address"
              name="address"
              disabled={true}
              value={userInput.address}
            />
          </div>
          <div className="flex-1">
            <Input
              label="Digital Address"
              name="digital_address"
              disabled={true}
              value={userInput.digital_address}
            />
          </div>
        </div>
        <div className="flex flex-col xl:flex-row xl:space-x-4 space-y-8 xl:space-y-0">
          <div className="flex-1">
            <Input
              label={
                <>
                  Institution Website URL
                  <span className="text-[#ff0404]">*</span>
                </>
              }
              name="website_url"
              value={userInput.website_url}
              onChange={handleUserInput}
              required
            />
          </div>
          <div className="flex-1">
            <Input
              label={
                <>
                  Post Office Mail Address
                  <span className="text-[#ff0404]">*</span>
                </>
              }
              type="text"
              name="mailing_address"
              value={userInput.mailing_address}
              onChange={handleUserInput}
              required
            />
          </div>
        </div>

        <div className="">
          <Input
            label="Other Contacts"
            name="alternate_contacts"
            value={userInput.alternate_contacts}
            onChange={handleUserInput}
          />
          <h4 className="text-[0.8rem] text-right">
            <span className="text-[#ff0404]">Note:</span> Use commas (,) to
            seperate different numbers
          </h4>
        </div>

        <div className="flex justify-between mb-4">
          <div className="w-[49%] h-[10rem] ">
            <h4 className="text-[0.9rem] mb-[0.4rem]">Institution Logo</h4>
            <div className="w-full h-full flex justify-center items-center rounded-[0.6rem] border">
              <label
                htmlFor="img"
                className="md:text-[0.9vw] text-[3vw] flex-col flex justify-center items-center cursor-pointer text-center"
              >
                {selectedImage !== null ? (
                  <div className="md:w-[4vw] w-[15vw] md:h-[4vw] h-[15vw]">
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="md:w-[4vw] w-[15vw] md:h-[4vw] h-[15vw]">
                    <img
                      src={
                        userInput?.logo && userInput?.logo !== "default.png"
                          ? `https://backend.baccheck.online/storage/app/public/${userInput?.logo}`
                          : "/assets/img/upload-t.svg"
                      }
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  id="img"
                  className="hidden"
                  accept=".jpg, .jpeg, .png"
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                />
                Browse to Upload file or image
              </label>
            </div>
          </div>
          <div className="w-[49%] h-[10rem]">
            <h4 className="text-[0.9rem] mb-[0.4rem]">
              Operation Certificate<span className="text-[#ff0404]">*</span>
            </h4>
            <div className="w-full h-full flex justify-center items-center rounded-[0.6rem] border">
              <label
                htmlFor="operationCert"
                className="md:text-[0.9vw] text-[3vw] flex-col flex justify-center items-center cursor-pointer text-center"
              >
                {selectedCert !== null ? (
                  <div className="w-fit md:h-[4vw] h-[15vw] flex items-center flex-col">
                    <IoDocumentText className="text-[3rem] text-[#ff0404]" />
                    <h6 className="text-nowrap text-[0.7rem] text-[#ff0404] w-[10rem] overflow-hidden text-ellipsis">
                      {selectedCert?.name}
                    </h6>
                  </div>
                ) : (
                  <>
                    {userInput?.operation_certificate ? (
                      <div className="w-fit md:h-[4vw] h-[15vw] flex items-center flex-col">
                        <IoDocumentText className="text-[3rem] text-[#ff0404]" />
                        <h6 className="text-nowrap text-[0.7rem] text-[#ff0404] w-[10rem] overflow-hidden text-ellipsis">
                          {userInput?.operation_certificate}
                        </h6>
                      </div>
                    ) : (
                      <div className="md:w-[4vw] w-[15vw] md:h-[4vw] h-[15vw]">
                        <img
                          src="/images/upload-t.svg"
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </>
                )}
                <input
                  type="file"
                  id="operationCert"
                  className="hidden"
                  accept=".pdf, .doc, .docx"
                  onChange={(e) => setSelectedCert(e.target.files[0])}
                />
                Browse to Upload file or image
              </label>
            </div>
            <h4 className="text-[0.7rem] text-right">
              <span className="text-[#ff0404]">Accepted Formats</span> doc,
              docx, pdf
            </h4>
          </div>
        </div>
        <div className="flex justify-end mt-[4rem!important]">
          <button
            type="submit"
            className={`flex items-center bg-[#ff0404] hover:bg-[#f77f7f] text-white px-4 py-2.5 rounded-[0.3rem] font-medium ${
              isSaving && "cursor-not-allowed bg-[#f77f7f]"
            }`}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Spinner size="sm" color="white" />
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
  );
}

export default InstitutionDataSetup;
