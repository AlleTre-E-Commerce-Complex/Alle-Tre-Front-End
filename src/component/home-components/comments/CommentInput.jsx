import React, { useState } from "react";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import { Button } from "semantic-ui-react";

const CommentInput = ({ onSubmit, onCancel, initialValue = "", isLoading = false, placeholder, buttonText }) => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];
  const [comment, setComment] = useState(initialValue);

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment);
      setComment("");
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={placeholder || selectedContent[localizationKeys.commentPlaceholder]}
        className="w-full p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-primary dark:focus:border-[#d4af37] outline-none transition-all resize-none min-h-[120px] text-sm font-medium"
      />
      
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
          {comment.length} characters
        </span>
        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-[10px] font-bold text-gray-400 hover:text-primary transition-all uppercase tracking-wider"
            >
              {selectedContent[localizationKeys.cancel]}
            </button>
          )}
          <Button
            onClick={handleSubmit}
            loading={isLoading}
            disabled={!comment.trim() || isLoading}
            className="!bg-primary hover:!bg-primary/90 !text-white !rounded-xl !px-6 !py-2.5 !font-bold !text-xs !uppercase !tracking-wider !transition-all disabled:!opacity-50"
          >
            {buttonText || selectedContent[localizationKeys.postComment]}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentInput;
