import React, { useState, useEffect } from "react";
import axios from "@/utils/axiosConfig";
import { Button, Select, SelectItem, Input } from "@nextui-org/react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

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

  // Submit the verification update request.
  // Note: We set checklist_sections to null.
  const handleSubmit = async () => {
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
      // Clear the newly requested questions and refresh pending updates
      setRequestedVerificationQuestions({});
      fetchVerificationSections();
    } catch (error) {
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
            <h3 className="text-md font-semibold mb-2">Verification Checklist Sections:</h3>
            {verificationSections.map((section) => (
              <div key={section.id} className="mb-3 p-3 border rounded">
                <h4 className="font-semibold text-black">{section.name}</h4>
                <p className="text-xs text-gray-600 mb-2">{section.description}</p>
                <p className="text-xs text-gray-600 mb-2">Weight: {section.weight}</p>

                {/* Existing Items */}
                <div className="mt-2 ml-2">
                  {section.items?.map((item) => (
                    <div key={item.id} className="mb-3">
                      <p className="font-medium">{item.question_text}</p>
                      <label className="flex items-center space-x-1 accent-bChkRed">
                        <input
                          type="checkbox"
                          checked={item.is_mandatory}
                          readOnly
                          className="cursor-pointer"
                        />
                        <span className="text-xs">Required</span>
                      </label>
                    </div>
                  ))}
                </div>

                {/* Pending Updates for This Section */}
                {pendingVerificationUpdates.find(update => update.id === section.id)?.items?.length > 0 && (
                  <div className="mt-4 border-t pt-2">
                    <p className="text-sm font-medium text-orange-500">Pending Updates:</p>
                    {pendingVerificationUpdates
                      .find(update => update.id === section.id)
                      ?.items.map((item) => (
                        <div key={item.id} className="mb-2">
                          <p className="font-medium">{item.question_text}</p>
                          <label className="flex items-center space-x-1 accent-bChkRed">
                            <input
                              type="checkbox"
                              checked={item.is_mandatory}
                              readOnly
                              className="cursor-pointer"
                            />
                            <span className="text-xs">Required</span>
                          </label>
                        </div>
                      ))}
                  </div>
                )}

                {/* New Requested Verification Items (Pending Submission) */}
                {requestedVerificationQuestions[section.id]?.length > 0 && (
                  <div className="mt-4 border-t pt-2">
                    <p className="text-sm font-medium text-blue-500 mb-2">
                      New Questions (Pending Submission):
                    </p>
                    {requestedVerificationQuestions[section.id].map((item) => (
                      <div key={item.id} className="mb-2">
                        <p className="font-medium">{item.question_text}</p>
                        <label className="flex items-center space-x-1 accent-bChkRed">
                          <input
                            type="checkbox"
                            checked={item.is_mandatory}
                            readOnly
                            className="cursor-pointer"
                          />
                          <span className="text-xs">Required</span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Display New Sections That Exist Only in Pending Updates */}
            {pendingVerificationUpdates
              .filter(update => !verificationSections.some(section => section.id === update.id))
              .map((newSec) => (
                <div key={newSec.id} className="mb-3 p-3 border border-orange-500 rounded bg-orange-50">
                  <h4 className="font-semibold text-orange-600">{newSec.name} (New Section)</h4>
                  <p className="text-xs text-gray-600 mb-2">{newSec.description}</p>
                  <p className="text-xs text-gray-600 mb-2">Weight: {newSec.weight}</p>
                  {newSec.items.map((item) => (
                    <div key={item.id} className="mb-2">
                      <p className="font-medium">{item.question_text}</p>
                      <label className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          checked={item.is_mandatory}
                          readOnly
                          className="cursor-pointer"
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
            className="cursor-pointer"
          />
          <span>Is Required</span>
        </label>
        <Button onClick={handleAddVerificationQuestion} size="sm" className="mt-3 bg-green-500 text-white">
          Add Verification Question
        </Button>
      </div>

      {/* Submit Button */}
      <Button onClick={handleSubmit} className="mt-4 bg-black text-white">
        Submit Verification Update Request
      </Button>
    </div>
  );
}
