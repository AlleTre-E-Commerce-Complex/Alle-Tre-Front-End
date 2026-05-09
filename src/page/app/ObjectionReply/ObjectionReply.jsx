import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import { authAxios } from "../../../config/axios-config";
import { toast } from "react-hot-toast";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FaCloudUploadAlt, FaTimes, FaFileAlt } from "react-icons/fa";
import moment from "moment";
import LoadingTest3arbon from "../../../component/shared/lotties-file/loading-test-3arbon";
import { Dimmer } from "semantic-ui-react";
import { useAuthState } from "../../../context/auth-context";

const ObjectionReply = () => {
  const { objectionId } = useParams();
  const [lang] = useLanguage();
  const selectedContent = content[lang];
  const history = useHistory();
  const { user } = useAuthState();
  const [objection, setObjection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchObjection = async () => {
      try {
        const response = await authAxios.get(`/payments-v2/objections/${objectionId}`);
        if (response.data.success) {
          setObjection(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching objection:", error);
        toast.error(selectedContent[localizationKeys.somethingWentWrong]);
      } finally {
        setLoading(false);
      }
    };
    fetchObjection();
  }, [objectionId, selectedContent]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("replyReason", values.replyReason);
    formData.append("replyDescription", values.replyDescription);
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await authAxios.post(
        `/payments-v2/objections/${objectionId}/reply`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        toast.success(selectedContent[localizationKeys.repliedSuccessfully]);
        history.push("/profile/deposit-details");
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast.error(selectedContent[localizationKeys.somethingWentWrong]);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <Dimmer active inverted className="fixed w-full h-full top-0 bg-white z-[100]">
      <LoadingTest3arbon />
    </Dimmer>
  );

  if (!objection) return <div className="text-center py-20 dark:text-white">{selectedContent[localizationKeys.somethingWentWrong]}</div>;

  const expiresAt = moment(objection.createdAt).add(2, "days");
  const isExpired = moment().isAfter(expiresAt);
  const hasReplied = !!objection.repliedAt;
  const isSender = objection.userId === user?.id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-32 min-h-screen animate-in">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {selectedContent[localizationKeys.objectionDetails]}
      </h1>

      {/* Original Objection Section */}
      <div className="bg-white dark:bg-[#151A23] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {objection.product?.images?.[0] && (
            <img
              src={objection.product.images[0].imageLink}
              alt={objection.product.title}
              className="w-full md:w-48 h-48 object-cover rounded-xl"
            />
          )}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {objection.product?.title}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              {selectedContent[localizationKeys.raisedBy]}: <span className="font-semibold text-gray-700 dark:text-gray-200">{objection.user?.userName}</span> ({moment(objection.createdAt).format("MMM DD, YYYY")})
            </p>
            <div className="p-4 bg-gray-50 dark:bg-[#0F172A] rounded-xl border border-gray-100 dark:border-gray-800">
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                {selectedContent[localizationKeys.reason]}:
              </p>
              <p className="text-gray-900 dark:text-white mb-4 font-medium">
                {objection.reason}
              </p>
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                {selectedContent[localizationKeys.description]}:
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {objection.description}
              </p>
            </div>

            {objection.documents?.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-bold text-gray-400 uppercase mb-3">
                  {selectedContent[localizationKeys.attachedFiles]}:
                </p>
                <div className="flex flex-wrap gap-2">
                  {objection.documents.map((doc, idx) => (
                    <a
                      key={idx}
                      href={doc.imageLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:border-amber-500 transition-colors"
                    >
                      <FaFileAlt className="text-amber-500" />
                      <span>File {idx + 1}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reply Form Section */}
      {!hasReplied && !isExpired && !isSender && (
        <div className="bg-white dark:bg-[#151A23] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            {selectedContent[localizationKeys.replyToObjection]}
          </h3>
          <Formik
            initialValues={{ replyReason: "", replyDescription: "" }}
            validationSchema={Yup.object({
              replyReason: Yup.string().required(selectedContent[localizationKeys.required]),
              replyDescription: Yup.string().required(selectedContent[localizationKeys.required]),
            })}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    {selectedContent[localizationKeys.reasonForReply]}
                  </label>
                  <Field
                    name="replyReason"
                    placeholder="Enter short reason"
                    className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    {selectedContent[localizationKeys.replyDescription]}
                  </label>
                  <Field
                    as="textarea"
                    name="replyDescription"
                    rows={4}
                    placeholder="Provide a detailed explanation"
                    className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    {selectedContent[localizationKeys.uploadImagesOrDocuments]}
                  </label>
                  <div
                    onClick={() => fileInputRef.current.click()}
                    className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 group transition-colors"
                  >
                    <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <FaCloudUploadAlt className="text-2xl text-amber-500" />
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 font-medium text-center">
                      {selectedContent[localizationKeys.uploadImagesOrDocuments]}
                    </span>
                    <input
                      type="file"
                      multiple
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {files.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      {files.map((file, idx) => (
                        <div
                          key={idx}
                          className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700"
                        >
                          {file.type.startsWith("image/") ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt="preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FaFileAlt className="text-4xl text-gray-400" />
                          )}
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <FaTimes size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-[48px] bg-[#FDC02A] hover:bg-[#E5AD26] text-black font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : selectedContent[localizationKeys.replyToObjection]}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      )}

      {/* Submitted Reply Section */}
      {hasReplied && (
        <div className="bg-white dark:bg-[#151A23] border border-green-100 dark:border-green-900/30 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {selectedContent[localizationKeys.objectionReply]}
            </h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                {selectedContent[localizationKeys.reasonForReply]}:
              </p>
              <p className="text-gray-900 dark:text-white font-bold text-lg">
                {objection.replyReason}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                {selectedContent[localizationKeys.replyDescription]}:
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                {objection.replyDescription}
              </p>
            </div>
            {objection.replyDocuments?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-3">
                    {selectedContent[localizationKeys.attachedFiles]}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {objection.replyDocuments.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc.imageLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:border-green-500 transition-colors shadow-sm"
                      >
                        <FaFileAlt className="text-green-500" />
                        <span>File {idx + 1}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      )}

      {/* Expired Message */}
      {isExpired && !hasReplied && (
        <div className="bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-900/30 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
          <div className="p-3 bg-red-100 dark:bg-red-500/20 rounded-xl">
            <FaTimes className="text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-800 dark:text-red-400 mb-1">
              {selectedContent[localizationKeys.objectionExpired]}
            </h3>
            <p className="text-red-700 dark:text-red-500/80 text-sm font-medium">
              {selectedContent[localizationKeys.objectionExpiredDesc]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObjectionReply;
