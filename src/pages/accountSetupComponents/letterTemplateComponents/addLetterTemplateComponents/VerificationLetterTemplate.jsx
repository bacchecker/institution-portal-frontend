import { Select, SelectItem } from "@nextui-org/react";
import React, { useState } from "react";
import SunEditor from "suneditor-react";

function VerificationLetterTemplate({ institutionDocuments }) {
  const [value, setValue] = useState("");
  return (
    <div className="w-[70%] border border-[#ff040459] rounded-[0.5rem] p-4 content">
      <Select
        size="sm"
        label={
          <>
            Document Type
            <span className="text-[#ff0404]">*</span>
          </>
        }
        className="w-full border border-[#ff040459] rounded-[0.3rem] overflow-hidden"
        name="document_type_id"
        // onChange={(e) => handleItemChange(e, i)}
      >
        {institutionDocuments?.data?.types?.map((item) => (
          <SelectItem key={item?.id}>{item?.document_type?.name}</SelectItem>
        ))}
      </Select>
      <div className="w-full flex justify-end mt-4">
        <button
          type="button"
          className="w-fit flex items-center bg-[#000000] hover:bg-[#282727] text-white px-4 py-2.5 rounded-[0.3rem] font-medium"
        >
          Import Default Template
        </button>
      </div>
      <div className="w-full mt-4">
        <SunEditor
          setContents={value}
          height="400"
          setOptions={{
            buttonList: [
              ["undo", "redo"],
              ["bold", "underline", "italic", "list", "align"],
              ["font", "fontSize", "italic", "list", "fontColor"],
              ["table", "horizontalRule", "link", "indent", "image"],
              ["formatBlock", "paragraphStyle", "fullScreen"],
            ],
          }}
          onChange={(value) => setValue(value)}
        />
      </div>
    </div>
  );
}

export default VerificationLetterTemplate;
