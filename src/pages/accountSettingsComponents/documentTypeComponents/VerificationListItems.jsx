import React, { useState, useEffect } from "react";
import axios from "@/utils/axiosConfig";
import { Button, Select, SelectItem, Input } from "@nextui-org/react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { IoTrashOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";

export default function VerificationChecklistManager({ selectedDocumentType }) {
  // State for existing verification sections (from document type)
  const [verificationSections, setVerificationSections] = useState([]);
  // State for pending verification updates (from pending-update endpoint)
  const [pendingVerificationUpdates, setPendingVerificationUpdates] = useState([]);
  // New verification section state (for adding a new section)
  const [newVerificationSection, setNewVerificationSection] = useState({ name: "", description: "", weight: "" });
  // Selected section ID (for adding a new verification question)
  const [selectedVerificationSectionId, setSelectedVerificationSectionId] = useState("");
  // New verification question state
  const [newVerificationQuestion, setNewVerificationQuestion] = useState({
    question_text: "",
    is_mandatory: true,
  });
  // Store newly requested verification questions separately (per section)
  const [requestedVerificationQuestions, setRequestedVerificationQuestions] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch existing verification sections and pending updates
  const fetchVerificationSections = async () => {
    // Use verification_checklist_sections from the document type if available
    if (selectedDocumentType?.verification_checklist_sections) {
      setVerificationSections(selectedDocumentType.verification_checklist_sections);
    }
    try {
      const response = await axios.get(
        `/institution/document-types/${selectedDocumentType.document_type_id}/pending-update`
      );
      // Assuming pending updates are returned under data.requested_changes.verification_checklist_sections
      const pendingData = response.data.data?.requested_changes?.verification_sections || [];
      // Format pending data: convert weight to number and is_mandatory from "1"/"0" strings to boolean
      const formattedPending = pendingData.map(section => ({
        ...section,
        weight: Number(section.weight),
        items: section.items.map(item => ({
          ...item,
          is_mandatory: parseInt(item.is_mandatory, 10) === 1,
        })),
      }));
      setPendingVerificationUpdates(formattedPending);
    } catch (error) {
      console.error("Error fetching pending verification updates:", error);
    }
  };

  useEffect(() => {
    fetchVerificationSections();
  }, [selectedDocumentType]);

  // Add a new verification section
  const handleAddVerificationSection = () => {
    if (!newVerificationSection.name.trim()) return toast.error("Section name is required.");
    if (!newVerificationSection.weight || isNaN(newVerificationSection.weight))
      return toast.error("Weight is required and must be numeric.");

    const newSectionData = {
      id: uuidv4(),
      name: newVerificationSection.name,
      description: newVerificationSection.description,
      weight: Number(newVerificationSection.weight),
      items: [],
    };

    toast.success('Section added successfully')
    setVerificationSections([...verificationSections, newSectionData]);
    setNewVerificationSection({ name: "", description: "", weight: "" });
    // Auto-select the new section for adding a question
    setSelectedVerificationSectionId(newSectionData.id);
  };

  // Add a new verification question (item) to an existing section
  const handleAddVerificationQuestion = () => {
    if (!selectedVerificationSectionId)
      return toast.error("Select a verification section to add the question.");
    if (!newVerificationQuestion.question_text.trim())
      return toast.error("Question text is required.");

    const newQuestionData = {
      id: uuidv4(),
      question_text: newVerificationQuestion.question_text,
      is_mandatory: newVerificationQuestion.is_mandatory, // Boolean value
    };

    setRequestedVerificationQuestions(prev => ({
      ...prev,
      [selectedVerificationSectionId]: [
        ...(prev[selectedVerificationSectionId] || []),
        newQuestionData,
      ],
    }));

    // Reset question input (defaulting is_mandatory to true)
    setNewVerificationQuestion({ question_text: "", is_mandatory: true });
  };

  // Remove a section before submission
  const handleRemoveSection = (sectionId) => {
    setVerificationSections(prevSections => prevSections.filter(section => section.id !== sectionId));
    setRequestedVerificationQuestions(prev => {
      const updatedQuestions = { ...prev };
      delete updatedQuestions[sectionId];
      return updatedQuestions;
    });
    toast.success("Section removed successfully.");
  };

  // Remove a question from pending submission
  const handleRemoveQuestion = (sectionId, questionId) => {
    setRequestedVerificationQuestions(prev => ({
      ...prev,
      [sectionId]: prev[sectionId]?.filter(question => question.id !== questionId),
    }));
    toast.success("Question removed successfully.");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const formattedVerificationSections = verificationSections
      .filter(section => requestedVerificationQuestions[section.id] && requestedVerificationQuestions[section.id].length > 0)
      .map((section, sectionIndex) => ({
        id: section.id,
        name: section.name,
        description: section.description,
        weight: section.weight,
        order: sectionIndex + 1,
        items: requestedVerificationQuestions[section.id].map((item, itemIndex) => ({
          id: item.id,
          question_text: item.question_text,
          is_mandatory: item.is_mandatory ? 1 : 0,
          order: (section.items?.length || 0) + itemIndex + 1,
        })),
      }));

    const payload = {
      checklist_sections: null,
      verification_sections: formattedVerificationSections,
    };

    console.log("Payload being sent:", JSON.stringify(payload, null, 2));

    try {
      await axios.post(
        `/institution/document-types/${selectedDocumentType.document_type_id}/request-update`,
        payload
      );
      toast.success("Verification update request sent successfully.");
      setIsSubmitting(false)
      setRequestedVerificationQuestions({});
      fetchVerificationSections();
    } catch (error) {
      setIsSubmitting(false)
      console.error("Error submitting verification update:", error.response?.data.message || error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="">
      {/* Display Existing Verification Sections & Items */}
      <div className="w-full">
        {verificationSections?.length > 0 && (
          <div className="mb-4">
            {verificationSections
              .filter(
                (section) =>
                  requestedVerificationQuestions[section.id]?.length > 0 || // Show section if it has new questions
                  pendingVerificationUpdates.find((update) => update.id === section.id)?.items?.length > 0 // Show section if it has pending updates
              )
              .map((section) => (
                <div key={section.id} className="mb-3 p-3 border rounded">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-black">{section?.name}</h4>
                      <p className="text-xs text-gray-600 mb-2">{section?.description}</p>
                      <p className="text-xs text-bChkRed mb-2">Weight: {section?.weight}%</p>
                    </div>
                    
                    {/* Remove Section Button */}
                    <Button 
                      size="sm"
                      className="bg-transparent text-bChkRed"
                      onClick={() => handleRemoveSection(section.id)}
                    >
                      <IoTrashOutline size={22}/>
                    </Button>
                  </div>

                  {/* Show New Questions (Pending Submission) */}
                  {requestedVerificationQuestions[section.id]?.length > 0 && (
                    <div className="mt-4 border-t pt-2">
                      <p className="text-sm font-medium text-blue-500 mb-2">
                        New Questions (Pending Submission):
                      </p>
                      {requestedVerificationQuestions[section.id].map((item) => (
                        <div key={item.id} className="mb-2 flex justify-between items-center">
                          <div>
                            <p className="font-medium">{item.question_text}</p>
                            <label className="flex items-center space-x-1">
                              <input
                                type="checkbox"
                                checked={item.is_mandatory}
                                readOnly
                                className="cursor-pointer accent-bChkRed"
                              />
                              <span className="text-xs">Required</span>
                            </label>
                          </div>
                          
                          {/* Remove Question Button */}
                          <Button 
                            size="sm"
                            className="bg-transparent text-bChkRed"
                            onClick={() => handleRemoveQuestion(section.id, item.id)}
                          >
                            <IoMdClose size={22}/>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* Pending Updates (Separate from Existing Sections) */}
        {pendingVerificationUpdates.length > 0 && (
          <div className="mt-6 p-3 border border-orange-600 rounded bg-orange-50">
            <h3 className="text-md font-semibold text-orange-600 mb-2">Pending Updates</h3>
            {pendingVerificationUpdates.map((update) => (
              <div key={update.id} className="mb-4 p-3 border border-orange-400 rounded">
                <h4 className="font-semibold text-orange-600">{update.name} {verificationSections.some(section => section.id === update.id) ? "(Update)" : "(New Section)"}</h4>
                <p className="text-xs text-gray-600 mb-2">{update?.description}</p>
                <p className="text-xs text-gray-600 mb-2">Weight: {update?.weight}</p>

                {/* Pending Questions */}
                {update.items.map((item) => (
                  <div key={item.id} className="mb-2 pl-2 border-l-4 border-orange-300">
                    <p className="font-medium">{item.question_text}</p>
                    <label className="flex items-center space-x-1">
                      <input
                        type="checkbox"
                        checked={item.is_mandatory}
                        readOnly
                        className="cursor-pointer accent-bChkRed"
                      />
                      <span className="text-xs">Required</span>
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>



      {/* Add New Verification Section */}
      <div className="border p-2 rounded-md mb-4">
        <h3 className="font-semibold mb-1">Add New Verification Section</h3>
        <Input
          radius="sm"
          size="sm"
          label="Section Name"
          value={newVerificationSection.name}
          onChange={(e) => setNewVerificationSection({ ...newVerificationSection, name: e.target.value })}
        />
        <Input
          radius="sm"
          size="sm"
          label="Description"
          value={newVerificationSection.description}
          onChange={(e) => setNewVerificationSection({ ...newVerificationSection, description: e.target.value })}
          className="mt-2"
        />
        <Input
          radius="sm"
          size="sm"
          label="Weight"
          value={newVerificationSection.weight}
          onChange={(e) => setNewVerificationSection({ ...newVerificationSection, weight: e.target.value })}
          className="mt-2"
        />
        <Button onClick={handleAddVerificationSection} radius="sm" size="sm" className="mt-3 bg-blue-500 text-white">
          Add Verification Section
        </Button>
      </div>

      {/* Add Verification Question to Existing Section */}
      <div className="border p-2 rounded-md mb-4">
        <h3 className="font-semibold mb-1">Add Verification Question to Existing Section</h3>
        <Select size="sm" label="Select Verification Section" onChange={(e) => setSelectedVerificationSectionId(e.target.value)}>
          {verificationSections.map((section) => (
            <SelectItem key={section.id} value={section.id}>
              {section.name}
            </SelectItem>
          ))}
        </Select>
        <Input
          size="sm"
          label="Question Text"
          value={newVerificationQuestion.question_text}
          onChange={(e) => setNewVerificationQuestion({ ...newVerificationQuestion, question_text: e.target.value })}
          className="mt-2"
        />
        <label className="flex items-center space-x-2 mt-2">
          <input
            type="checkbox"
            checked={newVerificationQuestion.is_mandatory}
            onChange={(e) => setNewVerificationQuestion({ ...newVerificationQuestion, is_mandatory: e.target.checked })}
            className="cursor-pointer accent-bChkRed"
          />
          <span>Is Required</span>
        </label>
        <Button onClick={handleAddVerificationQuestion} size="sm" className="mt-3 bg-green-500 text-white">
          Add Verification Question
        </Button>
      </div>

      {/* Submit Button */}
      <Button isLoading={isSubmitting} onClick={handleSubmit} className="mt-4 bg-black text-white">
        Submit Verification Update Request
      </Button>
    </div>
  );
}
