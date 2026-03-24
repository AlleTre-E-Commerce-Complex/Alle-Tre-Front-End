import React, { useEffect, useState } from "react";
import { Dimmer } from "semantic-ui-react";
import api from "../../api";
import { axios } from "../../config/axios-config";
import { useLanguage } from "../../context/language-context";
import useAxios from "../../hooks/use-axios";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import LodingTestAllatre from "../shared/lotties-file/loding-test-allatre";

const ItemDetails = ({ itemDetailsData }) => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];
  const [sysField, setSysField] = useState([]);
  const itemDetailsDataObject = Object.keys(itemDetailsData || {});
  const itemDetailsArray = sysField
    .map((field) => {
      const matchedKey = itemDetailsDataObject.find(
        (key) => key === field.resKey,
      );
      if (!matchedKey) return null;
      return {
        label: {
          en: field?.labelEn,
          ar: field?.labelAr,
        },
        value: itemDetailsData?.[matchedKey],
      };
    })
    .filter((item) => item !== null);

  const extraSpecs = [
    { label: { en: "Trim", ar: "القصة" }, value: itemDetailsData?.trim },
    { label: { en: "Kilometers", ar: "الكيلومترات" }, value: itemDetailsData?.kilometers },
    { label: { en: "Regional Specs", ar: "المواصفات الإقليمية" }, value: itemDetailsData?.regionalSpecs },
    { label: { en: "Transmission", ar: "ناقل الحركة" }, value: itemDetailsData?.transmissionType },
    { label: { en: "Engine Capacity", ar: "سعة المحرك" }, value: itemDetailsData?.engineCapacity },
    { label: { en: "Horsepower", ar: "قوة الحصان" }, value: itemDetailsData?.horsepower },
    { label: { en: "Cylinders", ar: "اسطوانات" }, value: itemDetailsData?.numberOfCylinders },
    { label: { en: "Fuel Type", ar: "نوع الوقود" }, value: itemDetailsData?.fuelType },
    { label: { en: "Doors", ar: "أبواب" }, value: itemDetailsData?.doors },
    { label: { en: "Seating Capacity", ar: "سعة المقاعد" }, value: itemDetailsData?.seatingCapacity },
    { label: { en: "Steering Side", ar: "جانب القيادة" }, value: itemDetailsData?.steeringSide },
    { label: { en: "Interior Color", ar: "اللون الداخلي" }, value: itemDetailsData?.interiorColor },
    { label: { en: "Insured", ar: "مؤمن" }, value: itemDetailsData?.insuredInUae },
    { label: { en: "Warranty", ar: "الضمان" }, value: itemDetailsData?.warranty },
    { label: { en: "Emirate", ar: "الإمارة" }, value: itemDetailsData?.emirate },
    { label: { en: "Total Closing Fee", ar: "إجمالي رسوم الإغلاق" }, value: itemDetailsData?.totalClosingFee },
    { label: { en: "Bathrooms", ar: "حمامات" }, value: itemDetailsData?.numberOfBathrooms },
    { label: { en: "Developer", ar: "المطور" }, value: itemDetailsData?.developer },
    { label: { en: "Ready By", ar: "جاهز بحلول" }, value: itemDetailsData?.readyBy },
    { label: { en: "Annual Community Fee", ar: "رسوم المجتمع السنوية" }, value: itemDetailsData?.annualCommunityFee },
    { label: { en: "Furnished", ar: "مفروشة" }, value: itemDetailsData?.isFurnished },
    { label: { en: "Property Reference ID", ar: "رقم مرجع العقار" }, value: itemDetailsData?.propertyReferenceId },
    { label: { en: "Buyer Transfer Fee", ar: "رسوم نقل المشتري" }, value: itemDetailsData?.buyerTransferFee },
    { label: { en: "Seller Transfer Fee", ar: "رسوم نقل البائع" }, value: itemDetailsData?.sellerTransferFee },
    { label: { en: "Maintenance Fee", ar: "رسوم الصيانة" }, value: itemDetailsData?.maintenanceFee },
    { label: { en: "Occupancy Status", ar: "حالة الإشغال" }, value: itemDetailsData?.occupancyStatus },
    { label: { en: "Zoned For", ar: "مخصص لـ" }, value: itemDetailsData?.zonedFor },
    { label: { en: "Approved Build-up Area", ar: "مساحة البناء المعتمدة" }, value: itemDetailsData?.approvedBuildUpArea },
    { label: { en: "Freehold", ar: "تملك حر" }, value: itemDetailsData?.freehold },
    { label: { en: "Residential Type", ar: "النوع السكني" }, value: itemDetailsData?.residentialType },
    { label: { en: "Commercial Type", ar: "النوع التجاري" }, value: itemDetailsData?.commercialType },
  ].filter((spec) => spec.value && spec.value !== "undefined");

  const combinedDetailsArray = [...itemDetailsArray, ...extraSpecs];

  const { run: runSysField, isLoading: isLoadingysField } = useAxios([]);

  useEffect(() => {
    runSysField(
      axios.get(api.app.customField.systemField).then((res) => {
        setSysField(res?.data?.data?.filter((field) => !!field) || []);
      }),
    );
  }, [runSysField]);
  return (
    <>
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/20 dark:bg-black/40 backdrop-blur-sm z-[9999]"
        active={isLoadingysField}
        inverted
      >
        <LodingTestAllatre />
      </Dimmer>

      <div className="animate-in fade-in duration-700">
        {/* Item Description */}
        {itemDetailsData?.description?.trim() && (
          <div id="itemDescription" className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-8 bg-primary rounded-full" />
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                {selectedContent[localizationKeys.aboutTheBrand]}
              </h2>
            </div>
            <div className="bg-white dark:bg-transparent border border-primary-veryLight dark:border-primary-lightDark rounded-xl p-8 shadow-sm">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap font-medium">
                {itemDetailsData?.description}
              </p>
            </div>
          </div>
        )}

        {/* Consolidated Details Container */}
        <div className="bg-white dark:bg-transparent rounded-xl sm:p-8 sm:border border-primary-veryLight dark:border-primary-lightDark">
          
          {/* Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-8 gap-x-6">
            {combinedDetailsArray.map((field, index) => {
              if (
                field.value === null ||
                field.value === undefined ||
                field.value === ""
              )
                return null;

              return (
                <div key={index} className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                    {field?.label[lang]}
                  </span>
                  <span className="text-base font-bold text-gray-900 dark:text-white capitalize truncate">
                    {field.value}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Extra Features (If Available) */}
          {(() => {
            const parseFeatures = (str) => {
              try { return JSON.parse(str) || []; } catch(e) { return []; }
            };
            const featuresLists = [
              { label: { en: "Driver Assistance", ar: "مساعدة السائق" }, items: parseFeatures(itemDetailsData?.driverAssistance) },
              { label: { en: "Entertainment", ar: "الترفيه" }, items: parseFeatures(itemDetailsData?.entertainment) },
              { label: { en: "Comfort", ar: "الراحة" }, items: parseFeatures(itemDetailsData?.comfort) },
              { label: { en: "Exterior Features", ar: "الميزات الخارجية" }, items: parseFeatures(itemDetailsData?.exteriorFeatures) },
              { label: { en: "Amenities", ar: "المرافق" }, items: parseFeatures(itemDetailsData?.amenities) },
            ].filter(list => list.items.length > 0);

            if (featuresLists.length === 0) return null;

            return (
              <>
                <div className="w-full h-px bg-primary-veryLight dark:bg-primary-lightDark my-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featuresLists.map((list, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-base font-bold text-gray-900 dark:text-white mb-4">
                        {list.label[lang] || list.label["en"]}
                      </span>
                      <div className="flex flex-wrap gap-3">
                        {list.items.map((item, idxx) => (
                          <span key={idxx} className="px-4 py-2 bg-gray-50 dark:bg-slate-800/80 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium border border-primary-veryLight dark:border-primary-lightDark capitalize">
                            {item.replace(/-/g, " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </>
  );
};

export default ItemDetails;
