import React, { useState } from "react";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import { FaUser, FaHeart, FaRegHeart, FaEdit, FaTrash } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import CommentInput from "./CommentInput";

const CommentItem = ({ 
  comment, 
  currentUser, 
  onLike, 
  onEdit, 
  onDelete, 
  onSubmit,
  isAdmin = false,
  sellerId
}) => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const isOwner = currentUser?.id === comment?.user?.id;
  const isSeller = sellerId && comment?.user?.id === sellerId;
  const canModify = isOwner || isAdmin;

  const handleEdit = (newText) => {
    onEdit(comment.id, newText);
    setIsEditing(false);
  };

  const handleReply = (newText) => {
    onSubmit(newText, comment.id); // Reusing onSubmit for replies
    setIsReplying(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 p-5 bg-white dark:bg-slate-900/40 rounded-2xl border border-gray-100 dark:border-white/5 transition-all duration-300 hover:border-primary/20 group">
        {/* Avatar */}
        <div className="shrink-0">
          {comment?.user?.imageLink ? (
            <img
              src={comment.user.imageLink}
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-gray-100 dark:ring-slate-800"
              alt={comment?.user?.userName}
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center ring-1 ring-gray-100 dark:ring-slate-800">
              <FaUser className="text-gray-400 text-sm" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-gray-900 dark:text-white">
                {comment?.user?.userName}
              </span>
              {isSeller && !isOwner && (
                <span className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-[#d4af37] text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border border-yellow-500/20">
                  Seller
                </span>
              )}
              {isOwner && (
                <span className="bg-primary/5 dark:bg-primary/10 text-primary dark:text-[#d4af37] text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border border-primary/10">
                  Author
                </span>
              )}
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                {comment?.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : ""}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {!isEditing && (
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!comment?.parentId && (
                    <button
                      onClick={() => setIsReplying(!isReplying)}
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors ${isReplying ? 'text-primary bg-primary/5' : 'text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                    >
                      {selectedContent[localizationKeys.reply] || "Reply"}
                    </button>
                  )}
                  {canModify && (
                    <div className="flex items-center border-l dark:border-white/5 pl-2 gap-1">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                        title={selectedContent[localizationKeys.edit]}
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(comment.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        title={selectedContent[localizationKeys.delete]}
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              <button
                onClick={() => onLike(comment.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all ${
                  comment?.isLiked 
                  ? "bg-red-50 dark:bg-red-900/20 text-red-500" 
                  : "bg-gray-50 dark:bg-slate-800/50 text-gray-400 hover:text-red-400"
                }`}
              >
                {comment?.isLiked ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
                <span className="text-xs font-bold">{comment?.likesCount || 0}</span>
              </button>
            </div>
          </div>

          {isEditing ? (
            <div className="pt-2">
              <CommentInput
                initialValue={comment?.content}
                onSubmit={handleEdit}
                onCancel={() => setIsEditing(false)}
                buttonText={selectedContent[localizationKeys.saveChanges]}
              />
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {comment?.content}
            </p>
          )}

          {isReplying && (
            <div className="pt-4 border-t border-gray-100 dark:border-white/5">
              <CommentInput
                onSubmit={handleReply}
                placeholder={selectedContent[localizationKeys.writeAReply]}
                buttonText={selectedContent[localizationKeys.reply]}
              />
            </div>
          )}
        </div>
      </div>

      {/* Simplified Threading */}
      {comment?.replies?.length > 0 && (
        <div className="ml-6 md:ml-10 space-y-4 border-l-2 border-gray-50 dark:border-white/5 pl-6 md:pl-10">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUser={currentUser}
              onLike={onLike}
              onEdit={onEdit}
              onDelete={onDelete}
              onSubmit={onSubmit}
              isAdmin={isAdmin}
              sellerId={sellerId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
