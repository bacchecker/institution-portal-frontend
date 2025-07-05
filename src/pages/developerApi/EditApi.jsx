import { useEffect, useState } from "react";
import SideModal from "@/components/SideModal";
import Swal from "sweetalert2";
import { toast } from "sonner";
import PropTypes from "prop-types";
import axios from "@/utils/axiosConfig";
import { Radio, RadioGroup } from "@heroui/react";

function EditApi({
  setOpenModal,
  openModal,
  apiScopes,
  selectedApi,
  fetchApiKeys,
}) {
  const [userInput, setUserInput] = useState({});
  const [groupedScopes, setGroupedScopes] = useState({});
  const [selectedScopes, setSelectedScopes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedApi && openModal) {
      setUserInput({
        ...selectedApi,
        environment: selectedApi.environment || "test",
      });

      // Ensure selected scopes are IDs
      const perms = selectedApi?.scopes?.map((perm) => perm.name) || [];
      setSelectedScopes(perms);
    }
  }, [selectedApi, openModal]);

  // Group scopes by category and subcategory
  useEffect(() => {
    if (openModal && Object.keys(apiScopes || {}).length > 0) {
      setGroupedScopes(apiScopes);
    }
  }, [openModal, apiScopes]);

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setUserInput({ ...userInput, [name]: value });
  };

  const handleCheckboxChange = (scopeName) => {
    setSelectedScopes((prev) => {
      const prevArray = Array.isArray(prev) ? prev : [];
      return prevArray.includes(scopeName)
        ? prevArray.filter((name) => name !== scopeName)
        : [...prevArray, scopeName];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent double submission

    setIsSubmitting(true);

    const { name, id } = userInput;

    if (!name) {
      Swal.fire("Error", "Fill all required fields", "error");
      setIsSubmitting(false);
      return;
    }

    if (!selectedScopes.length) {
      Swal.fire("Error", "Select at least one scope", "error");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        name: userInput.name,
        scopes: selectedScopes,
      };

      const response = await axios.put(
        `/v1/institution/api-keys/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(response.data.message);
      setOpenModal(false);
      fetchApiKeys();
    } catch (err) {
      console.error("Error updating API:", err);
      if (err.response && err.response.data && err.response.data.errors) {
        console.log("Validation errors:", err.response.data.errors);
      }
      toast.error("Failed to update api");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SideModal
      title="Edit Api"
      setOpenModal={setOpenModal}
      openModal={openModal}
    >
      <form
        onSubmit={handleSubmit}
        className="px-3 w-full overflow-auto pt-[1vw]"
      >
        <div className="flex flex-col">
          {/* Api Name */}
          <div className="mb-4">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              API Name <span className="text-[#f1416c]">*</span>
            </h4>
            <input
              type="text"
              name="name"
              value={userInput.name || ""}
              onChange={handleUserInput}
              className="w-full border rounded-sm p-2 focus:outline-none"
            />
          </div>

          <div className="mb-2">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Environment<span className="text-[#f1416c]">*</span>
            </h4>
            <RadioGroup
              orientation="horizontal"
              value={userInput.environment}
              onValueChange={(value) =>
                setUserInput((prev) => ({
                  ...prev,
                  environment: value,
                }))
              }
            >
              <Radio size="sm" value="test">
                Test
              </Radio>
              <Radio size="sm" value="live">
                Live
              </Radio>
            </RadioGroup>
          </div>

          {/* Scopes */}
          <div className="mt-4">
            <h4 className="md:text-[1vw] text-[4vw] mb-1">
              Scopes <span className="text-[#f1416c]">*</span>
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(groupedScopes || {}).map(([resource, scopes]) => (
                <div key={resource} className="mb-4">
                  <div className="flex items-center gap-[0.5vw]">
                    <h2 className="text-[14px] capitalize font-[600]">
                      {`Manage ${resource.replace("-", " ")}`}
                    </h2>
                    <input
                      type="checkbox"
                      className="checkbox-design1"
                      onChange={(e) => {
                        const names = scopes.map((s) => s.name);
                        if (e.target.checked) {
                          setSelectedScopes((prev) => [
                            ...new Set([...prev, ...names]),
                          ]);
                        } else {
                          setSelectedScopes((prev) =>
                            prev.filter((name) => !names.includes(name))
                          );
                        }
                      }}
                      checked={scopes.every((s) =>
                        selectedScopes.includes(s.name)
                      )}
                    />
                  </div>
                  <div className="ml-[0.1vw] mt-[0.3vw]">
                    {scopes.map(({ name, action }) => (
                      <div key={name} className="ml-[0.5vw]">
                        <label className="flex items-center gap-[0.3vw] text-[0.9vw] cursor-pointer mb-1">
                          <input
                            type="checkbox"
                            className="checkbox-design1"
                            checked={selectedScopes.includes(name)}
                            onChange={() => handleCheckboxChange(name)}
                          />
                          <span>{(action || "").replace("-", " ")}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#FF0404] mt-4 w-full py-2 rounded-md text-white hover:bg-[#ef4545] disabled:bg-gray-400"
        >
          <h4 className="text-sm text-[#ffffff]">
            {isSubmitting ? "Updating..." : "Update Api"}
          </h4>
        </button>
      </form>
    </SideModal>
  );
}

EditApi.propTypes = {
  setOpenModal: PropTypes.func.isRequired,
  openModal: PropTypes.bool.isRequired,
  fetchApiKeys: PropTypes.func.isRequired,
  apiScopes: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        resource: PropTypes.string,
        action: PropTypes.string,
      })
    )
  ).isRequired,
  selectedApi: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    environment: PropTypes.string,
    scopes: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      })
    ),
  }),
};

export default EditApi;
