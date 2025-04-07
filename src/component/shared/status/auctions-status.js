import React from "react";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";

// DRAFTED - PENDING_OWNER_DEPOIST-PUBLISHED-ARCHIVED-SOLD-EXPIRED
// ON_TIME - SCHEDULED

const AuctionsStatus = ({ status, small, big, absolute }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const baseButtonClasses = `
    state-button
    transition-all
    duration-150
    font-medium
    rounded
    inline-flex
    items-center
    justify-center
    text-xs
    ${small ? "px-2 py-0.5 text-[10px]" : ""}
    ${big ? "px-4 py-1.5 text-xs" : "px-2.5 py-1 text-[11px]"}
    ${absolute ? "absolute" : ""}
  `;

  const statusStyles = {
    ACTIVE: "bg-emerald-100 text-emerald-800",
    IN_SCHEDULED: "bg-orange-100 text-orange-800",
    SOLD: "bg-sky-100 text-sky-800",
    WAITING_FOR_PAYMENT: "bg-sky-100 text-sky-800",
    PENDING_OWNER_DEPOIST: "bg-indigo-100 text-indigo-800",
    EXPIRED: "bg-slate-100 text-slate-800",
    IN_PROGRESS: "bg-teal-100 text-teal-800",
    PENDING_PAYMENT: "bg-violet-100 text-violet-800"
  };

  const getStatusButton = (statusKey, text) => (
    <button className={`${baseButtonClasses} ${statusStyles[statusKey]}`}>
      {text}
    </button>
  );

  const statusMap = {
    ACTIVE: selectedContent[localizationKeys.activeNow],
    IN_SCHEDULED: selectedContent[localizationKeys.Scheduled],
    SOLD: selectedContent[localizationKeys.sold],
    WAITING_FOR_PAYMENT: selectedContent[localizationKeys.sold],
    PENDING_OWNER_DEPOIST: selectedContent[localizationKeys.pending],
    EXPIRED: selectedContent[localizationKeys.expired],
    IN_PROGRESS: selectedContent[localizationKeys.inProgress],
    PENDING_PAYMENT: selectedContent[localizationKeys.pending]
  };

  return (
    <div>
      {status && statusMap[status] && getStatusButton(status, statusMap[status])}
    </div>
  );
};

export default AuctionsStatus;
