import React from "react";
import { MdLocationOn } from "react-icons/md";
import { Modal, Icon } from "semantic-ui-react";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";

const InspectionDetailsModal = ({ open, onClose, inspectionDetails }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const mapUrl = ` https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(
    `${inspectionDetails?.lat},${inspectionDetails?.lng}`
  )}&key=${process.env.REACT_APP_GOOGLE_MAP_SECRET_KEY}`;
  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        size="small"
        className="!rounded-xl overflow-hidden shadow-2xl transform transition-all max-w-lg w-full mx-auto max-h-[90vh] !m-4"
      >
        <div className="bg-primary text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="search" className="!text-md !block !m-0 " />
            <h2 className="text-xl font-semibold">
              {selectedContent[localizationKeys.inspectionDetails]}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <Icon name="close" className="!text-xl !block !m-0 mb-2" />
          </button>
        </div>

        <div className="px-4 py-2 bg-gray-50 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Contact Person Section */}
            <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon
                    name="user"
                    className="!text-xl text-primary !block !m-0"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedContent[localizationKeys.contactPerson]}
                </h3>
              </div>
              <div className="space-y-3 pl-2">
                <p className="text-gray-700 flex items-center gap-2">
                  <span className="font-medium">
                    {selectedContent[localizationKeys.name]}:
                  </span>
                  <span>
                    {inspectionDetails?.contactPerson || "Not specified"}
                  </span>
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  <span className="font-medium">
                    {selectedContent[localizationKeys.phone]}:
                  </span>
                  <span>
                    {inspectionDetails?.phone || "No phone number available"}
                  </span>
                </p>
              </div>
            </div>

            {/* Date & Time Section */}
            {/* <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon
                    name="calendar alternate outline"
                    className="!text-xl text-primary !block !m-0"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedContent[localizationKeys.dateAndTime]}
                </h3>
              </div>
              <div className="space-y-3 pl-2">
                <p className="text-gray-700 flex items-center gap-2">
                  <span className="font-medium">
                    {selectedContent[localizationKeys.Date]}:
                  </span>
                  <span>
                    <p className="text-gray-700">
                      {inspectionDetails?.date || "Not specified"}
                    </p>
                  </span>
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  <span className="font-medium">
                    {selectedContent[localizationKeys.time]}:
                  </span>
                  <span>
                    <p className="text-gray-700">
                      {inspectionDetails?.time || "Not specified"}
                    </p>
                  </span>
                </p>
              </div>
            </div> */}
            {/* Location Section */}
            <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon
                    name="map marker alternate"
                    className="!text-xl text-primary !block !m-0"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedContent[localizationKeys.location]}
                </h3>
              </div>
              <p className="text-gray-700 pl-2">
                {(inspectionDetails?.cityEn || inspectionDetails?.cityAr) &&
                (inspectionDetails?.countryEn ||
                  inspectionDetails?.countryAr) ? (
                  <span className="flex items-center gap-2">
                    <span>{`${
                      lang === "en"
                        ? inspectionDetails?.cityEn
                        : inspectionDetails?.cityAr
                    }, ${
                      lang === "en"
                        ? inspectionDetails?.countryEn
                        : inspectionDetails?.countryAr
                    }`}</span>
                  </span>
                ) : (
                  selectedContent[localizationKeys.locationNotAvailable]
                )}
              </p>
              <div className="mt-4">
                <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                  {inspectionDetails?.lat && inspectionDetails?.lng ? (
                    <iframe
                      title="Google Map"
                      className="w-full h-[200px] border-0"
                      src={mapUrl}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 font-medium text-sm "
          >
            {selectedContent[localizationKeys.close]}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default InspectionDetailsModal;
