import React, { useState, useEffect } from "react";
import axios from "@/utils/axiosConfig";
import { Button, Select, SelectItem, Input } from "@nextui-org/react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { IoMdClose } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";

const inputTypes = [
  { label: "Text Input", value: "text" },
  { label: "Date Picker", value: "date" },
  { label: "Yes / No", value: "yes_no" },
  { label: "Dropdown", value: "dropdown" },
];

export default function ChecklistManager({ selectedDocumentType }) {
    const [sections, setSections] = useState([]);
    const [pendingUpdates, setPendingUpdates] = useState([]);
    const [newSection, setNewSection] = useState({ name: "", description: "" });
    const [selectedSectionId, setSelectedSectionId] = useState("");
    const [newQuestion, setNewQuestion] = useState({ 
        question_text: "", 
        input_type: "text", 
        options: "",
        is_mandatory: true
    });


  const [requestedQuestions, setRequestedQuestions] = useState({});

  // Fetch sections and pending updates
    const fetchSections = async () => {
        if (selectedDocumentType?.checklist_sections) {
            setSections(selectedDocumentType.checklist_sections);
        }

        try {
            const response = await axios.get(
                `/institution/document-types/${selectedDocumentType.document_type_id}/pending-update`
            );

            const pendingData = response.data.data?.requested_changes?.checklist_sections || [];

            // Ensure `is_mandatory` is properly formatted (convert "1"/"0" strings to integers)
            const formattedPendingUpdates = pendingData.map(section => ({
                ...section,
                items: section.items.map(item => ({
                    ...item,
                    is_mandatory: parseInt(item.is_mandatory, 10), // Convert "1"/"0" to integer
                })),
            }));

            setPendingUpdates(formattedPendingUpdates);
        } catch (error) {
            console.error("Error fetching pending updates:", error);
        }
    };
    useEffect(() => {
        fetchSections();
    }, [selectedDocumentType]);


  const handleAddSection = () => {
    if (!newSection.name.trim()) return toast.error("Section name is required.");
    
    const newSectionData = {
        id: uuidv4(), // Temporary unique ID
        name: newSection.name,
        description: newSection.description,
        checklist_items: [],
    };
    toast.success('Section added successfully')
    setSections([...sections, newSectionData]);
    setNewSection({ name: "", description: "" });

    // Auto-select the new section in the dropdown
    setSelectedSectionId(newSectionData.id);
  };

    const handleAddQuestion = () => {
        if (!selectedSectionId) return toast.error("Select a section to add the question.");
        if (!newQuestion.question_text.trim()) return toast.error("Question text is required.");

        const newQuestionData = {
            id: uuidv4(),
            question_text: newQuestion.question_text,
            input_type: newQuestion.input_type,
            is_mandatory: Boolean(newQuestion.is_mandatory),
            options: newQuestion.input_type === "dropdown" ? newQuestion.options.split(",").map(opt => opt.trim()) : null,
        };

        setRequestedQuestions((prev) => ({
            ...prev,
            [selectedSectionId]: [...(prev[selectedSectionId] || []), newQuestionData],
        }));

        setNewQuestion({ question_text: "", input_type: "text", options: "", is_mandatory: true });
    };

    const handleRemoveSection = (sectionId) => {
      setSections((prevSections) => prevSections.filter((section) => section.id !== sectionId));
      setRequestedQuestions((prev) => {
        const updatedQuestions = { ...prev };
        delete updatedQuestions[sectionId];
        return updatedQuestions;
      });
      toast.success("Section removed successfully.");
    };
  
    const handleRemoveQuestion = (sectionId, questionId) => {
      setRequestedQuestions((prev) => ({
        ...prev,
        [sectionId]: prev[sectionId]?.filter((question) => question.id !== questionId),
      }));
      toast.success("Question removed successfully.");
    };
    
    const handleSubmit = async () => {
        const formattedSections = sections
            .filter(section => requestedQuestions[section.id] && requestedQuestions[section.id].length > 0)
            .map((section, sectionIndex) => ({
                id: section.id && typeof section.id === "string" ? section.id : uuidv4(),
                name: section.name,
                description: section.description,
                order: sectionIndex + 1,
                items: requestedQuestions[section.id].map((item, itemIndex) => ({
                    id: item.id,
                    question_text: item.question_text,
                    input_type: item.input_type,
                    is_mandatory: item.is_mandatory ? 1 : 0,
                    order: section.checklist_items.length + itemIndex + 1,
                    options: item.input_type === "dropdown" ? item.options : null,
                })),
            }));
    
        const payload = {
            checklist_sections: formattedSections,
            verification_sections: []
        };
    
        //console.log("Payload being sent:", JSON.stringify(payload, null, 2));
    
        try {
            await axios.post(
                `/institution/document-types/${selectedDocumentType.document_type_id}/request-update`,
                payload
            );
            toast.success("Checklist update request sent successfully.");
            setRequestedQuestions({});
            fetchSections();
        } catch (error) {
            console.error("Error submitting request:", error.response?.data.message || error);
            toast.error(error?.response?.data?.message);
        }
    };
    



  return (
    <div className="">
      {/* Display Existing Sections & Questions */}
      <div className="w-full">
        {sections?.length > 0 && (
          <div className="mb-4">
            {sections
              .filter(
                (section) =>
                  requestedQuestions[section.id]?.length > 0
              )
              .map((section) => (
                <div key={section.id} className="mb-3 p-3 border rounded">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-black">{section?.name}</h4>
                      <p className="text-xs text-gray-600 mb-2">{section?.description}</p>
                    </div>
                    <Button 
                      size="sm"
                      className="bg-transparent text-bChkRed"
                      onClick={() => handleRemoveSection(section.id)}
                    >
                      <IoTrashOutline size={22}/>
                    </Button>
                  </div>

                  {requestedQuestions[section.id]?.length > 0 && (
                    <div className="mt-4 border-t pt-2">
                      <p className="text-sm font-medium text-blue-500 mb-2">
                        New Questions (Pending Submission):
                      </p>
                      {requestedQuestions[section.id].map((item) => (
                        <div key={item.id} className="mb-2 flex justify-between items-center">
                          <p className="font-medium">{item.question_text}</p>
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
      </div>


      {/* Add New Section */}
      <div className="border p-2 rounded-md mb-4">
        <h3 className="font-semibold mb-1">Add New Section</h3>
        <Input
          radius="sm"
          size="sm"
          label="Section Name"
          value={newSection.name}
          onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
        />
        <Input
          radius="sm"
          size="sm"
          label="Description"
          value={newSection.description}
          onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
          className="mt-2"
        />
        <Button onClick={handleAddSection} radius="sm" size="sm" className="mt-3 bg-blue-500 text-white">
          Add Section
        </Button>
      </div>

      {/* Add Question to Existing Section */}
      <div className="border p-2 rounded-md mb-4">
        <h3 className="font-semibold mb-1">Add Question to Existing Section</h3>
        <Select size="sm" label="Select Section" onChange={(e) => setSelectedSectionId(e.target.value)}>
          {sections.map((section) => (
            <SelectItem key={section.id} value={section.id}>
              {section.name}
            </SelectItem>
          ))}
        </Select>
        <Input size="sm" label="Question Text" value={newQuestion.question_text} onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })} className="mt-2" />
        <div className="flex flex-col">
            <Select 
                label="Input Type"
                size="sm"
                value={newQuestion.input_type} 
                onChange={(e) => setNewQuestion({ ...newQuestion, input_type: e.target.value })} 
                className="mt-2"
            >
                {inputTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                        {type.label}
                    </SelectItem>
                ))}
            </Select>

            {/* Mandatory Checkbox */}
            <label className="flex items-center space-x-2 mt-2 accent-bChkRed">
                <input 
                    type="checkbox" 
                    checked={newQuestion.is_mandatory} 
                    onChange={(e) => setNewQuestion({ ...newQuestion, is_mandatory: e.target.checked })} 
                    className="cursor-pointer"
                />
                <span>Is Required</span>
            </label>
        </div>

        

        {/* Dropdown options input */}
        {newQuestion.input_type === "dropdown" && (
          <Input
            label="Dropdown Options (comma-separated)"
            value={newQuestion.options}
            onChange={(e) => setNewQuestion({ ...newQuestion, options: e.target.value })}
            className="mt-2"
          />
        )}

        <Button onClick={handleAddQuestion} size="sm" className="mt-3 bg-green-500 text-white">
          Add Question
        </Button>
      </div>

      {/* Submit Button */}
      <Button onClick={handleSubmit} className="mt-4 bg-black text-white">
        Submit Update Request
      </Button>
    </div>
  );
}
