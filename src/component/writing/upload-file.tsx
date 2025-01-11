import React, { useState, ChangeEvent } from "react";
import { FiTrash2, FiFile } from "react-icons/fi";

const FileUploader = ({
  onFileChange,
}: {
  onFileChange: (files: File[]) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (newFiles) {
      const newFileArray = Array.from(newFiles); // Convert FileList to array
      setFiles((prevFiles) => {
        const updatedFiles = [...prevFiles, ...newFileArray]; // Append new files to previous files
        onFileChange(updatedFiles); // Pass all files to the parent component
        return updatedFiles;
      });
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((file) => file !== fileToRemove); // Remove selected file
      onFileChange(updatedFiles); // Pass updated files to the parent component
      return updatedFiles;
    });
  };

  return (
    <div
      style={{
        border: "1px dashed #CFCFCF",
        borderRadius: "8px",
        minHeight: "200px",
        padding: "20px",
        textAlign: "center",
        width: "100%",
        margin: "20px auto",
        position: "relative",
      }}
    >
      {files.length === 0 ? (
        <>
          <input
            type="file"
            id="fileInput"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              height: "100%",
              opacity: 0,
              cursor: "pointer",
            }}
            onChange={handleFileChange}
            multiple // Allow multiple file selection
          />
          <label
            htmlFor="fileInput"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#F7F6FF",
              padding: "10px 20px",
              borderRadius: "20px",
              border: "1px dashed #9C89FF",
              color: "#9C89FF",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Upload Your Answer
          </label>
        </>
      ) : (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            alignItems: "center",
          }}
        >
          {files.map((file) => (
            <div
              key={file.name}
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#9C89FF",
                padding: "8px 15px",
                borderRadius: "20px",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              <FiFile style={{ marginRight: "8px" }} />
              {file.name}
              <FiTrash2
                onClick={() => handleRemoveFile(file)}
                style={{
                  color: "#FF4D4F",
                  cursor: "pointer",
                  fontSize: "18px",
                  marginLeft: "10px",
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
