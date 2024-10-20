import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import React from "react";

export default function FileUploader({
  disclosure,
  data,
  dragActive,
  handleChange,
  handleDrag,
  handleDrop,
  getFileIcon,
  errors,
  isDismissable = false,
  isKeyboardDismissDisabled = true,
  className = "z-[99]",
  backdrop = "blur", // backdrop="transparent"
}) {
  return (
    <Modal
      isOpen={disclosure.isOpen}
      onOpenChange={disclosure.onOpenChange}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      className={className}
      backdrop={backdrop}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Upload Documents
            </ModalHeader>
            <ModalBody>
              <div>
                <div className="sticky top-0 z-50 bg-white dark:bg-slate-900 pb-5">
                  <div className="border-2 border-primary shadow-sm rounded-xl p-4 bg-gray-50 dark:bg-slate-900">
                    <div
                      className={`p-3 border-2 border-dashed rounded-lg ${
                        dragActive
                          ? "border-blue-400 bg-red-50"
                          : "border-gray-300"
                      }`}
                    >
                      <input
                        type="file"
                        multiple
                        id="file-upload"
                        name="document"
                        className="hidden"
                        onChange={handleChange}
                        accept=".pdf,.docx,.doc,.txt,.xlsx,.xls"
                      />

                      {data.documents && data.documents.length > 0 ? (
                        <div className="flex flex-col">
                          {data.documents.map((file, index) => (
                            <label
                              key={index}
                              htmlFor="file-upload"
                              className="flex items-center cursor-pointer mb-2"
                            >
                              <p className="flex items-center text-base font-semibold text-slate-600 dark:text-slate-200">
                                <span className="mr-2">
                                  {getFileIcon(file.type)}
                                </span>
                                {file.name}
                              </p>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <label
                          htmlFor="file-upload"
                          className="flex items-center justify-center h-full py-0 text-center cursor-pointer gap-x-2"
                        >
                          <svg
                            className="w-8 h-8 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            ></path>
                          </svg>
                          <div className="text-left">
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              Click to select or attach documents
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-300">
                              (PDF, DOCX, XLSX, or Text files only)
                            </p>
                          </div>
                        </label>
                      )}
                      {dragActive && (
                        <div
                          className="absolute inset-0 z-50"
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                        ></div>
                      )}
                    </div>
                    {errors.documents && (
                      <small className="mt-2 text-sm text-danger">
                        {errors.documents}
                      </small>
                    )}
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="danger"
                onClick={() => {
                  console.log("file upload endpoint");

                  // post(route("upload-document"), {
                  //     data,

                  // });
                }}
              >
                Upload Documents
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
