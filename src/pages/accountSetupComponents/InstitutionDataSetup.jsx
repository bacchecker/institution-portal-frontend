import React, { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { useCreateInstitutionSetupMutation } from "../../redux/apiSlice";
import Swal from "sweetalert2";
import LoadItems from "../../components/LoadItems";
import { toast } from "sonner";
import { setUser, setUserToken } from "../../redux/authSlice";
import { useDispatch } from "react-redux";

function InstitutionDataSetup({ setActiveStep }) {
  const user = JSON?.parse(secureLocalStorage?.getItem("user"));
  const dispatch = useDispatch();
  const [userInput, setUserInput] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);
  useEffect(() => {
    if (user?.institution) {
      setUserInput(user?.institution);
    }
  }, []);

  const handleUserInput = (e) => {
    setUserInput((userInput) => ({
      ...userInput,
      [e.target.name]: e.target.value,
    }));
  };

  const [
    createInstitutionSetup,
    { data, isSuccess, isLoading, isError, error },
  ] = useCreateInstitutionSetupMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    if (
      !description ||
      !institution_email ||
      !website_url ||
      !helpline_contact ||
      !mailing_address
    ) {
      Swal.fire({
        title: "Error",
        text: "Fill All Required Fields",
        icon: "error",
        button: "OK",
      });
    } else if (!operation_certificate && !selectedCert) {
      Swal.fire({
        title: "Error",
        text: "Operation Certificate is required",
        icon: "error",
        button: "OK",
      });
    } else {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("address", address);
      formData.append("description", description);
      academic_level && formData.append("academic_level", academic_level);
      formData.append("region", region);
      formData.append("website_url", website_url);
      formData.append("institution_email", institution_email);
      formData.append("helpline_contact", helpline_contact);
      formData.append("prefix", prefix);
      formData.append("digital_address", digital_address);
      formData.append("mailing_address", mailing_address);
      selectedImage && formData.append("logo", selectedImage);
      selectedCert && formData.append("operation_certificate", selectedCert);
      try {
        await createInstitutionSetup(formData);
      } catch (error) {
        toast.error("Failed to submit documents", {
          position: "top-right",
          autoClose: 1202,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      console.log("data", data);

      Swal.fire({
        title: "Success",
        text: data?.message,
        icon: "success",
        button: "OK",
        confirmButtonColor: "#00b17d",
      }).then((isOkay) => {
        if (isOkay) {
          const updatedInstitution = {
            ...data.institution,
            current_step: "2",
          };
          dispatch(
            setUser({
              user: user.user,
              two_factor: user.two_factor,
              institution: updatedInstitution,
              selectedTemplate: user.selectedTemplate,
            })
          );
          setActiveStep(2);
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      });
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isError]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full relative">
        <div className="w-[75%] px-[4vw] py-[2vw] mt-[3.5vw]">
          <h1 className="text-[1.5vw] font-[600] text-[#000]">
            Institution Account Setup
          </h1>
          <h4 className="text-[0.9vw] mt-[0.5vw]">
            Please provide all required details and manage your document types
            efficiently <br /> to activate your institution's account
          </h4>
        </div>
      </div>
      <form
        className="w-[75%] px-[4vw] mt-[1vw] mb-[4vw]"
        onSubmit={handleSubmit}
      >
        <div className="w-full h-[0.1vw] bg-[#E2E2E2]"></div>
        <div className="flex flex-wrap w-full mt-[1vw] justify-between gap-y-[1.5vw]">
          <div className="w-[49%]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">Institution Name</h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                value={userInput?.name}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              />
            </div>
          </div>
          <div className="w-[49%]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Institution Prefix
            </h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                value={userInput?.prefix}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              />
            </div>
          </div>
          <div className="w-[49%]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Institution Email<span className="text-[#f1416c]">*</span>
            </h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="email"
                name="institution_email"
                required
                value={userInput?.institution_email}
                onChange={handleUserInput}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              />
            </div>
          </div>
          <div className="w-[49%]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Help Line Contact<span className="text-[#f1416c]">*</span>
            </h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                name="helpline_contact"
                required
                value={userInput?.helpline_contact}
                onChange={handleUserInput}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              />
            </div>
          </div>
          <div className="w-full">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Description
              <span className="text-[#f1416c]">*</span>
            </h4>
            <div class="relative w-full md:h-[10vw] h-[30vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <textarea
                placeholder="Enter institution desription"
                value={userInput?.description}
                name="description"
                required
                onChange={handleUserInput}
                className="w-full h-full md:p-[0.8vw] p-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              ></textarea>
            </div>
          </div>
        </div>
        <div className="w-full h-[0.1vw] bg-[#E2E2E2] mt-[2vw]"></div>
        <div className="flex flex-wrap w-full mt-[1vw] justify-between gap-y-[1.5vw]">
          <div className="w-[49%]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">Academic Level</h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                value={userInput?.academic_level}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              />
            </div>
          </div>
          <div className="w-[49%]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">Region</h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                value={userInput?.region}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              />
            </div>
          </div>
          <div className="w-[49%]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">Address</h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                value={userInput?.address}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              />
            </div>
          </div>
          <div className="w-[49%]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">Digital Address</h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                value={userInput?.digital_address}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              />
            </div>
          </div>
          <div className="w-[49%]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Institution Website URL<span className="text-[#f1416c]">*</span>
            </h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                name="website_url"
                required
                value={userInput?.website_url}
                onChange={handleUserInput}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              />
            </div>
          </div>
          <div className="w-[49%]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Post Office Mail Address<span className="text-[#f1416c]">*</span>
            </h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="text"
                name="mailing_address"
                required
                value={userInput?.mailing_address}
                onChange={handleUserInput}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              />
            </div>
          </div>
          <div className="w-[65%]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">Other Contacts</h4>
            <div className="flex items-center">
              <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
                <input
                  type="text"
                  name="alternate_contacts"
                  value={userInput?.alternate_contacts}
                  onChange={handleUserInput}
                  className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
                />
              </div>
              <div className="w-[30%] ml-[1vw]">
                <h4 className="text-[1vw] text-[#ff0404] underline">
                  Add Contact
                </h4>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-[0.1vw] bg-[#E2E2E2] mt-[2vw]"></div>
        <div className="flex flex-wrap w-full mt-[1vw] justify-between gap-y-[1.5vw]">
          <div className="w-[49%]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Institution Logo<span className="text-[#f1416c]">*</span>
            </h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] flex items-center rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="file"
                id="logoFile"
                accept=".jpg, .jpeg, .png"
                onChange={(e) => setSelectedImage(e.target.files[0])}
                className="w-full h-full hidden md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0"
              />
              <label
                htmlFor="logoFile"
                className="absolute right-[1vw] absolute-pos-items-center cursor-pointer"
              >
                <img src="/assets/img/uplo.svg" alt="" className="w-[1.5vw]" />
              </label>
              <h4 className="pl-[1vw] text-[1vw]">
                {selectedImage ? selectedImage?.name : "Browse to upload image"}{" "}
              </h4>
            </div>
            <h4 className="text-[0.7rem] text-right">
              <span className="text-[#ff0404]">Accepted Formats</span> jpg,
              jpeg, png
            </h4>
          </div>
          <div className="w-[49%]">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Operation Certificate<span className="text-[#f1416c]">*</span>
            </h4>
            <div className="relative w-full md:h-[2.7vw] h-[12vw] md:rounded-[0.3vw!important] flex items-center rounded-[1.5vw!important] overflow-hidden border-[1.5px] border-[#E5E5E5]">
              <input
                type="file"
                id="certFile"
                accept=".pdf, .doc, .docx"
                onChange={(e) => setSelectedCert(e.target.files[0])}
                className="w-full h-full md:px-[0.8vw] px-[2vw] md:text-[1vw] text-[3.5vw] focus:outline-none bg-[#f7f7f7] absolute left-0 right-0 bottom-0 top-0 hidden"
              />
              <label
                htmlFor="certFile"
                className="absolute right-[1vw] absolute-pos-items-center cursor-pointer"
              >
                <img src="/assets/img/uplo.svg" alt="" className="w-[1.5vw]" />
              </label>
              <h4 className="pl-[1vw] text-[1vw]">
                {selectedCert ? selectedCert?.name : "Browse to upload file"}{" "}
              </h4>
            </div>
            <h4 className="text-[0.7rem] text-right">
              <span className="text-[#ff0404]">Accepted Formats</span> doc,
              docx, pdf
            </h4>
          </div>
        </div>
        <div className="w-full flex justify-end mt-[2vw]">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#FF0404] md:my-[2vw!important] my-[4vw!important] w-fit flex justify-center items-center md:py-[0.7vw] py-[2vw] md:px-[2vw] h-[fit-content] md:rounded-[0.3vw] rounded-[2vw] gap-[0.5vw] hover:bg-[#ef4545] transition-all duration-300 disabled:bg-[#fa6767]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <LoadItems color={"#ffffff"} size={15} />
                <h4 className="md:text-[1vw] text-[3.5vw] text-[#ffffff]">
                  Saving...
                </h4>
              </div>
            ) : (
              <h4 className="md:text-[1vw] text-[3.5vw] text-[#ffffff]">
                Save & Contitnue
              </h4>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default InstitutionDataSetup;
