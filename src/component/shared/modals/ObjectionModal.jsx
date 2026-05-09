import React, { useState } from "react";
import { Modal } from "semantic-ui-react";
import { toast } from "react-hot-toast";
import { FaTrash, FaCloudUploadAlt } from "react-icons/fa";
import content from "../../../localization/content";
import { useLanguage } from "../../../context/language-context";
import localizationKeys from "../../../localization/localization-keys";
import useAxios from "../../../hooks/use-axios";
import { authAxios } from "../../../config/axios-config";
import api from "../../../api";

const ObjectionModal = ({ open, setOpen, product, onSuccess }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const { run, isLoading } = useAxios([]);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!reason.trim()) {
      toast.error(selectedContent[localizationKeys.required]);
      return;
    }

    const formData = new FormData();
    formData.append("productId", product.id);
    formData.append("reason", reason);
    formData.append("description", description);
    files.forEach((file) => {
      formData.append("files", file);
    });

    run(
      authAxios
        .post(api.app.payments.objection, formData)
        .then(() => {
          toast.success(selectedContent[localizationKeys.ThankYouForYourSubmission]);
          onSuccess?.();
          setOpen(false);
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || "Failed to submit objection");
        })
    );
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      className="max-w-[500px] w-[95%] rounded-2xl overflow-hidden bg-transparent !border-none !shadow-none"
    >
      <div className="bg-white dark:bg-[#0F172A] border border-gray-100 dark:border-white/10 shadow-2xl">
        <div className="bg-primary/95 dark:bg-[#1E293B]/90 backdrop-blur-md p-5 text-center border-b border-gray-100 dark:border-white/10">
          <h2 className="text-white text-xl font-bold">
            {selectedContent[localizationKeys.objection]}
          </h2>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {/* Reason */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
              {selectedContent[localizationKeys.reason]}
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-yellow outline-none transition-all"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Item not as described"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
              {selectedContent[localizationKeys.objectionDescription]}
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-[#1E293B] dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-yellow outline-none transition-all min-h-[120px] resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more details about your objection..."
            />
          </div>

          {/* File Upload */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
              {selectedContent[localizationKeys.uploadImagesOrDocuments]}
            </label>
            <div className="relative">
              <input
                type="file"
                multiple
                className="hidden"
                id="objection-files"
                onChange={handleFileSelect}
              />
              <label
                htmlFor="objection-files"
                className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl cursor-pointer hover:border-primary dark:hover:border-yellow transition-colors bg-gray-50 dark:bg-white/5"
              >
                <FaCloudUploadAlt className="text-3xl text-gray-400 dark:text-gray-500 mb-2" />
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {selectedContent[localizationKeys.clickToBrowse]}
                </span>
              </label>
            </div>
          </div>

          {/* File Preview */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto p-2 border border-gray-100 dark:border-gray-800 rounded-lg">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-200"
                >
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-[10px] text-gray-500 p-1 text-center truncate">
                      {file.name}
                    </div>
                  )}
                  <button
                    onClick={() => removeFile(idx)}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Warning Message */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/30 rounded-xl p-4 flex gap-3">
            <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-xs text-amber-800 dark:text-amber-200/90 leading-relaxed font-medium">
              {selectedContent[localizationKeys.objectionWarning]}
            </p>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 py-3.5 bg-primary dark:bg-yellow hover:bg-primary-dark dark:hover:bg-yellow-dark text-white dark:text-black font-black uppercase tracking-wider text-sm rounded-xl transition-all shadow-lg shadow-primary/30 dark:shadow-yellow/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Submitting..." : selectedContent[localizationKeys.Submit]}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="px-8 py-3.5 border-2 border-gray-200 dark:border-white/10 text-gray-600 dark:text-white font-black uppercase tracking-wider text-sm rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all active:scale-95"
            >
              {selectedContent[localizationKeys.cancel]}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ObjectionModal;
