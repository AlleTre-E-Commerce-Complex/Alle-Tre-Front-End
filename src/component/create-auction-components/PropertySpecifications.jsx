import React from "react";
import { useFormikContext } from "formik";
import { useLanguage } from "../../context/language-context";
import FormikMultiDropdown from "../../component/shared/formik/formik-dropdown";
import FormikInput from "../../component/shared/formik/formik-input";
import { allCustomFileOptions } from "../../utils/all-custom-fields-options";
import { IoSettingsOutline } from "react-icons/io5";
import { BiErrorCircle, BiInfoCircle } from "react-icons/bi";

// Helper components
const MultiPillGroup = ({ name, options, label }) => {
  const { values, setFieldValue, errors, touched } = useFormikContext();
  const currentValue = values[name];
  const hasError = touched[name] && errors[name];
  
  return (
    <div className="flex flex-col gap-2 w-full" id={name}>
      <div className="flex justify-start gap-2 items-center w-full">
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-0">{label}</label>
        {hasError && (
          <div className="text-xs font-normal flex items-center text-red-700 m-0">
            <BiErrorCircle className="ltr:mr-1 rtl:ml-1 w-3 h-3" />
            {errors[name]}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setFieldValue(name, opt.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
              currentValue === opt.value
                ? 'border-primary dark:border-yellow text-primary dark:text-yellow bg-primary/10 dark:bg-yellow/10'
                : hasError
                ? 'border-red-600 text-gray-600 dark:text-gray-300 hover:border-red-600'
                : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary dark:hover:border-yellow'
            }`}
          >
            {opt.text.split(" | ")[0]}
          </button>
        ))}
      </div>
    </div>
  );
};

const PropertySpecifications = ({ 
  subCategoryText, 
  AllCountriesOptions, 
  AllCitiesOptions, 
  loadingAllCountries, 
  loadingCitiesOptions,
  descriptionNode
}) => {
  const [lang] = useLanguage();
  const isArabic = lang === "ar";

  const getOptions = (key) => {
    return allCustomFileOptions[key]?.map(opt => {
      const parts = opt.text.split(" | ");
      return {
        ...opt,
        text: isArabic ? (parts.length > 1 ? parts[1] : parts[0]) : parts[0]
      };
    }) || [];
  };

  // Convert subCategoryText to lowercase for robust checking
  const subCatStr = (subCategoryText || "").toLowerCase();
  
  const isResidential = subCatStr.includes("residential") || subCatStr.includes("سكني") || subCatStr.includes("apartment") || subCatStr.includes("شقة") || subCatStr.includes("villa") || subCatStr.includes("فيلا") || subCatStr.includes("house") || subCatStr.includes("بيت") || subCatStr.includes("townhouse") || subCatStr.includes("تاون هاوس") || subCatStr.includes("منزل");
  const isCommercial = subCatStr.includes("commercial") || subCatStr.includes("تجاري") || subCatStr.includes("office") || subCatStr.includes("مكتب") || subCatStr.includes("retail") || subCatStr.includes("محل") || subCatStr.includes("warehouse") || subCatStr.includes("مستودع") || subCatStr.includes("industrial") || subCatStr.includes("صناعي") || subCatStr.includes("showroom") || subCatStr.includes("معرض");
  const isMultipleUnits = subCatStr.includes("multiple units") || subCatStr.includes("وحدات متعددة") || subCatStr.includes("building") || subCatStr.includes("مبنى") || subCatStr.includes("compound") || subCatStr.includes("مجمع");
  const isLand = subCatStr.includes("land") || subCatStr.includes("أرض");
  const { values, setFieldValue } = useFormikContext();

  const showRoomsAndBathrooms = isResidential;
  const showClosingFee = isResidential || isCommercial || isLand || isMultipleUnits;
  const showDeveloperAndReadyBy = isResidential || isCommercial || isMultipleUnits;
  const showCommunityFee = isResidential || isCommercial;
  const showTransferFeesAndRefId = isResidential || isCommercial || isLand || isMultipleUnits;
  const showMaintenanceAndOccupancy = isResidential || isCommercial || isMultipleUnits;
  const showAmenitiesAndFurnished = isResidential || isCommercial;
  const showZonedFor = isLand || isMultipleUnits;
  const showLandExclusive = isLand; 

  const bedroomsOptions = [
    { value: "studio", text: "Studio | استوديو" },
    ...Array.from({ length: 11 }, (_, i) => ({ value: `${i + 1}`, text: `${i + 1}` })),
    { value: "12+", text: "12+" },
  ];
  
  const bathroomsOptions = [
    ...Array.from({ length: 11 }, (_, i) => ({ value: `${i + 1}`, text: `${i + 1}` })),
    { value: "12+", text: "12+" },
  ];
  
  const furnishedOptions = [
    { value: "furnished", text: "Furnished | مفروش" },
    { value: "unfurnished", text: "Unfurnished | غير مفروش" },
  ];
  
  const occupancyOptions = [
    { value: "vacant", text: "Vacant | شاغر" },
    { value: "occupied", text: "Occupied | مشغول" },
  ];

  const getOptionalLabel = (enLabel, arLabel) => (
    <div className="flex justify-between items-center w-full gap-2">
      <span>{isArabic ? arLabel : enLabel}</span>
      <span className="text-[10px] font-normal text-gray-400 uppercase tracking-widest leading-none">
        {isArabic ? "(اختياري)" : "(Optional)"}
      </span>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-6 mx-auto mt-6">
      <div className="bg-white dark:bg-primary-dark border border-gray-200 dark:border-[#d4af37]/40 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <IoSettingsOutline className="dark:text-primary-light text-yellow w-6 h-6" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isArabic ? "مواصفات العقار" : "Property Specifications"}
          </h2>
        </div>

        <div className="grid gap-x-6 gap-y-6 md:grid-cols-2 grid-cols-1">
          {/* Always Show Location (Emirate instead of Country/City) */}
          <div className="w-full">
            <FormikMultiDropdown
              name="emirate"
              label={isArabic ? "الإمارة" : "EMIRATE"}
              placeholder={isArabic ? "اختر الإمارة" : "Select Emirate"}
              options={getOptions("emirates")}
            />
          </div>

          {/* Type Dropdown Depending on Category */}
          {isResidential && (
            <div className="w-full">
              <FormikMultiDropdown
                name="residentialType"
                label={isArabic ? "نوع العقار السكني" : "RESIDENTIAL TYPE"}
                placeholder={isArabic ? "اختر نوع العقار" : "Select Type"}
                options={getOptions("residentialType")}
              />
            </div>
          )}
          {isCommercial && (
            <div className="w-full">
              <FormikMultiDropdown
                name="commercialType"
                label={isArabic ? "نوع العقار التجاري" : "COMMERCIAL TYPE"}
                placeholder={isArabic ? "اختر نوع العقار" : "Select Type"}
                options={getOptions("commercialType")}
              />
            </div>
          )}

          {/* Shared Input: Total Area */}
          <div className="w-full">
            <FormikInput
              name="totalArea"
              type="number"
              min={0}
              label={isArabic ? "المساحة (قدم مربع) *" : "SIZE *"}
              placeholder={isArabic ? "SqFt" : "SqFt"}
            />
          </div>

          {showClosingFee && (
            <div className="w-full">
              <FormikInput
                name="totalClosingFee"
                type="number"
                min={0}
                label={getOptionalLabel("TOTAL CLOSING FEE", "إجمالي رسوم الإغلاق")}
                placeholder={isArabic ? "درهم إماراتي" : "AED"}
              />
            </div>
          )}

          {/* Conditional Inputs: Rooms, Bathrooms, Floors */}
          {showRoomsAndBathrooms && (
            <>
              <div className="w-full">
                <MultiPillGroup name="numberOfRooms" label={isArabic ? "غرف النوم" : "BEDROOMS"} options={bedroomsOptions.map(opt => ({...opt, text: isArabic ? (opt.text.split(" | ")[1] || opt.text) : opt.text.split(" | ")[0]}))} />
              </div>
              <div className="w-full">
                <MultiPillGroup name="numberOfBathrooms" label={isArabic ? "الحمامات" : "BATHROOMS"} options={bathroomsOptions} />
              </div>
            </>
          )}

          {showDeveloperAndReadyBy && (
            <>
              <div className="w-full">
                <FormikInput
                  name="developer"
                  type="text"
                  label={getOptionalLabel("DEVELOPER", "المطور")}
                  placeholder=""
                />
              </div>
              <div className="w-full">
                <FormikInput
                  name="readyBy"
                  type="date"
                  label={getOptionalLabel("READY BY", "جاهز بحلول")}
                  placeholder=""
                />
              </div>
            </>
          )}

          {showCommunityFee && (
             <div className="w-full">
                <FormikInput
                  name="annualCommunityFee"
                  type="number"
                  min={0}
                  label={getOptionalLabel("ANNUAL COMMUNITY FEE", "رسوم المجتمع السنوية")}
                  placeholder={isArabic ? "درهم إماراتي" : "AED"}
                />
              </div>
          )}

          {showTransferFeesAndRefId && (
            <>
              <div className="w-full">
                <FormikInput
                  name="propertyReferenceId"
                  type="text"
                  label={getOptionalLabel("PROPERTY REFERENCE ID #", "الرقم المرجعي للعقار")}
                  placeholder=""
                />
              </div>
              <div className="w-full">
                <FormikInput
                  name="buyerTransferFee"
                  type="number"
                  min={0}
                  label={getOptionalLabel("BUYER TRANSFER FEE", "رسوم نقل المشتري")}
                  placeholder={isArabic ? "درهم إماراتي" : "AED"}
                />
              </div>
              <div className="w-full">
                <FormikInput
                  name="sellerTransferFee"
                  type="number"
                  min={0}
                  label={getOptionalLabel("SELLER TRANSFER FEE", "رسوم نقل البائع")}
                  placeholder={isArabic ? "درهم إماراتي" : "AED"}
                />
              </div>
            </>
          )}
          {showMaintenanceAndOccupancy && (
             <div className="w-full">
                <FormikInput
                  name="maintenanceFee"
                  type="number"
                  min={0}
                  label={getOptionalLabel("MAINTENANCE FEE", "رسوم الصيانة")}
                  placeholder={isArabic ? "درهم إماراتي" : "AED"}
                />
              </div>
          )}

          {showAmenitiesAndFurnished && (
             <>
                <div className="w-full">
                  <FormikMultiDropdown
                    name="amenities"
                    label={getOptionalLabel("AMENITIES", "وسائل الراحة")}
                    placeholder=""
                    multiple
                    options={getOptions("amenities")}
                  />
                </div>
                <div className="w-full">
                  <MultiPillGroup name="isFurnished" label={isArabic ? "هل العقار مفروش؟" : "IS IT FURNISHED?"} options={furnishedOptions.map(opt => ({...opt, text: isArabic ? opt.text.split(" | ")[1] : opt.text.split(" | ")[0]}))} />
                </div>
             </>
          )}

          {showMaintenanceAndOccupancy && (
             <div className="w-[100%]">
                <MultiPillGroup name="occupancyStatus" label={isArabic ? "حالة الإشغال" : "OCCUPANCY STATUS"} options={occupancyOptions.map(opt => ({...opt, text: isArabic ? opt.text.split(" | ")[1] : opt.text.split(" | ")[0]}))} />
              </div>
          )}

          {showZonedFor && (
            <div className="w-full md:col-span-2 mt-4">
              <MultiPillGroup name="zonedFor" label={isArabic ? "مخصص لـ *" : "ZONED FOR *"} options={getOptions("zonedFor")} />
            </div>
          )}

          {showLandExclusive && (
            <>
              <div className="w-full">
                <FormikInput name="approvedBuildUpArea" type="number" min={0} label={getOptionalLabel("APPROVED BUILD UP AREA SIZE", "مساحة البناء المعتمدة")} placeholder="" />
              </div>
              <div className="w-full flex items-center justify-start gap-4 bg-gray-50 dark:bg-[#2C3241] p-4 rounded-xl">
                <input
                  type="checkbox"
                  id="freehold"
                  checked={values.freehold === "true"}
                  onChange={(e) => setFieldValue("freehold", e.target.checked ? "true" : "false")}
                  className="w-5 h-5 rounded border-gray-300 text-primary dark:border-gray-600 focus:ring-primary dark:bg-gray-800"
                />
                <label htmlFor="freehold" className="text-sm font-medium mb-0 cursor-pointer uppercase text-gray-900 dark:text-gray-100">
                  {isArabic ? "تملك حر" : "FREEHOLD"}
                </label>
              </div>
            </>
          )}

          {showTransferFeesAndRefId && (
            <div className="w-full bg-gray-50 dark:bg-[#2C3241] p-4 rounded-xl mt-4 flex items-start gap-2">
              <BiInfoCircle className="text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-500 dark:text-gray-400 m-0">
                {isArabic 
                  ? "من خلال تقديم معلومات خاطئة أدناه، فإنك تخضع لإلغاء تنشيط الحساب بالإضافة إلى احتمالية إبلاغ مؤسسة التنظيم العقاري و/أو السلطات الأخرى."
                  : "By providing false information below you are subject to account deactivation as well as potential reporting to RERA and/or other authorities."}
              </p>
            </div>
          )}

        </div>
        
        {/* Description Field */}
        <div className="mt-6 md:mt-8">
            {descriptionNode}
        </div>
      </div>
    </div>
  );
};

export default PropertySpecifications;
