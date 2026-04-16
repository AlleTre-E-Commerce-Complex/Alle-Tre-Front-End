import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import { useAuthState } from "../../../context/auth-context";
import { authAxios } from "../../../config/axios-config";
import api from "../../../api";
import useAxios from "../../../hooks/use-axios";
import { toast } from "react-hot-toast";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";
import { Loader } from "semantic-ui-react";

const CommentSection = ({ productId, isAdmin = false, onCountChange, sellerId }) => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];
  const { user } = useAuthState();
  const [comments, setComments] = useState([]);
  const { run, isLoading } = useAxios([]);
  const [isPosting, setIsPosting] = useState(false);

  const fetchComments = useCallback(() => {
    run(
      authAxios.get(api.app.comments.get(productId)).then((res) => {
        setComments(res.data.data);
        if (onCountChange) onCountChange(res.data.data.length);
      })
    ).catch((err) => {
      console.error("Failed to fetch comments", err);
    });
  }, [productId, run, onCountChange]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handlePostComment = async (text, parentId = null) => {
    if (!user) {
      toast.error(selectedContent[localizationKeys.loginToComment]);
      return;
    }

    setIsPosting(true);
    try {
      await authAxios.post(api.app.comments.add, {
        productId,
        content: text,
        parentId
      });
      fetchComments();
      toast.success(selectedContent[localizationKeys.commentPostedSuccessfully]);
    } catch (err) {
      toast.error(selectedContent[localizationKeys.oops]);
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = async (commentId) => {
    if (!user) {
      toast.error(selectedContent[localizationKeys.loginToLike]);
      return;
    }

    try {
      await authAxios.post(api.app.comments.like(commentId));
      setComments(prev => prev.map(c => {
        // 1. If it's the top-level comment being liked
        if (c.id === commentId) {
          return {
            ...c,
            isLiked: !c.isLiked,
            likesCount: c.isLiked ? c.likesCount - 1 : c.likesCount + 1
          };
        }
        // 2. Otherwise, check its replies
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.map(r => r.id === commentId ? {
              ...r,
              isLiked: !r.isLiked,
              likesCount: r.isLiked ? r.likesCount - 1 : r.likesCount + 1
            } : r)
          };
        }
        return c;
      }));
    } catch (err) {
      toast.error(selectedContent[localizationKeys.oops]);
    }
  };

  const handleEdit = async (commentId, text) => {
    try {
      await authAxios.put(api.app.comments.edit(commentId), { content: text });
      setComments(prev => prev.map(c => {
        // 1. If it's the top-level comment being edited
        if (c.id === commentId) return { ...c, content: text };
        
        // 2. Otherwise, check its replies
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.map(r => r.id === commentId ? { ...r, content: text } : r)
          };
        }
        return c;
      }));
      toast.success(selectedContent[localizationKeys.commentUpdatedSuccessfully]);
    } catch (err) {
      toast.error(selectedContent[localizationKeys.oops]);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await authAxios.delete(api.app.comments.delete(commentId));
      setComments(prev => {
        // 1. Filter out the top-level comment if ID matches
        const filtered = prev.filter(c => c.id !== commentId);
        
        // 2. Recursively filter out from the replies of remaining comments
        return filtered.map(c => ({
          ...c,
          replies: c.replies ? c.replies.filter(r => r.id !== commentId) : []
        }));
      });
      toast.success(selectedContent[localizationKeys.commentDeletedSuccessfully]);
    } catch (err) {
      toast.error(selectedContent[localizationKeys.oops]);
    }
  };

  return (
    <div className="mt-4 transition-all duration-300">
      <div className="space-y-8">
        {/* Comment Input */}
        <div className="bg-gray-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-gray-100 dark:border-white/5">
           <CommentInput 
             onSubmit={handlePostComment} 
             isLoading={isPosting} 
           />
        </div>

        {/* Comment List */}
        <div className="space-y-6">
          {isLoading && comments.length === 0 ? (
            <div className="py-20 flex justify-center">
              <Loader active inline="centered" size="medium" />
            </div>
          ) : comments.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-gray-400 text-sm font-medium">
                {selectedContent[localizationKeys.noCommentsYet]}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  currentUser={user}
                  onLike={handleLike}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onSubmit={handlePostComment}
                  isAdmin={isAdmin}
                  sellerId={sellerId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
