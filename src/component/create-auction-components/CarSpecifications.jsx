import React from "react";
import { useFormikContext } from "formik";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";
import FormikMultiDropdown from "../../component/shared/formik/formik-dropdown";
import FormikInput from "../../component/shared/formik/formik-input";
import { allCustomFileOptions } from "../../utils/all-custom-fields-options";
import { IoSettingsOutline } from "react-icons/io5";
import { BiErrorCircle } from "react-icons/bi";

// Helper components
const PillGroup = ({ name, options, label }) => {
  const { values, setFieldValue, errors, touched } = useFormikContext();
  const currentValue = values[name];

  return (
    <div className="flex flex-col gap-2 w-full" id={name}>
      <div className="flex justify-start gap-2 items-center w-full">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0">{label}</label>
        {touched[name] && errors[name] && (
          <div className="text-xs font-normal flex items-center text-red-700 m-0">
            <BiErrorCircle className="ltr:mr-1 rtl:ml-1 w-3 h-3" />
            {errors[name]}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 bg-gray-100 dark:bg-[#2C3241] p-1 rounded-xl w-max">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setFieldValue(name, opt.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentValue === opt.value
                ? 'bg-primary dark:bg-yellow text-white dark:text-black shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {opt.text.split(" | ")[0]}
          </button>
        ))}
      </div>
    </div>
  );
};

const MultiPillGroup = ({ name, options, label }) => {
  // same design but rounded-full for individual pills wrapped in standard div
  const { values, setFieldValue, errors, touched } = useFormikContext();
  const currentValue = values[name];
  
  return (
    <div className="flex flex-col gap-2 w-full" id={name}>
      <div className="flex justify-start gap-2 items-center w-full">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0">{label}</label>
        {touched[name] && errors[name] && (
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


const CarSpecifications = ({ brandNode, modelNode, descriptionNode }) => {
  const [lang] = useLanguage();
  const isArabic = lang === "ar";
 const selectedContent = content[lang];
  const getOptions = (key) => {
    return allCustomFileOptions[key]?.map(opt => {
      const parts = opt.text.split(" | ");
      return {
        ...opt,
        text: isArabic ? (parts.length > 1 ? parts[1] : parts[0]) : parts[0]
      };
    }) || [];
  };

  // Generate Year options (1950 to current year + 1)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1950 + 2 }, (_, i) => {
    const year = (currentYear - i).toString();
    return { key: year, text: year, value: year };
  });

  return (
    <div className="w-full flex flex-col gap-6 mx-auto mt-6">
      {/* 1. Vehicle Specifications Card */}
      <div className="bg-white dark:bg-primary-dark border border-gray-200 dark:border-[#d4af37]/40 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <IoSettingsOutline className="dark:text-primary-light text-yellow w-6 h-6" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {selectedContent[localizationKeys.vehicleSpecifications]}
          </h2>
        </div>

        <div className="grid gap-x-6 gap-y-6 md:grid-cols-3 grid-cols-1">
          {brandNode}
          {modelNode}
       
          {/* Row 1 */}
          <div className="w-full">
            <FormikInput name="trim" type="text" label={isArabic ? "الفئة (TRIM)" : "TRIM"} placeholder={isArabic ? "مثال: XLE" : "e.g. XLE"} />
          </div>
          <div className="w-full">
            <FormikInput name="kilometers" type="number" label={isArabic ? "الكيلومترات" : "KILOMETERS"} placeholder={isArabic ? "مثال: 15,000" : "e.g. 15,000"} />
          </div>
          <div className="w-full">
            <FormikMultiDropdown name="regionalSpecs" label={isArabic ? "المواصفات الإقليمية" : "REGION / SPECS"} placeholder={isArabic ? "اختر المواصفات" : "Select Region"} options={getOptions("regionalSpecs")} />
          </div>
          <div className="w-full">
            <FormikMultiDropdown name="carType" label={isArabic ? "نوع الهيكل" : "BODY TYPE"} placeholder={isArabic ? "اختر الهيكل" : "Select Body"} options={getOptions("carType")} />
          </div>
          <div className="w-full">
            <FormikMultiDropdown name="releaseYear" label={isArabic ? "سنة الصنع" : "YEAR"} placeholder={isArabic ? "اختر السنة" : "Select Year"} options={yearOptions} />
          </div>
          {/* Row 2 */}
          <div className="w-full">
            <FormikMultiDropdown name="engineCapacity" label={isArabic ? "سعة المحرك" : "ENGINE CAPACITY"} placeholder={isArabic ? "اختر السعة" : "Select Engine"} options={getOptions("engineCapacity")} />
          </div>
          
          <div className="w-full">
            <FormikMultiDropdown name="numberOfCylinders" label={isArabic ? "عدد الأسطوانات" : "NO. OF CYLINDERS"} placeholder={isArabic ? "اختر الأسطوانات" : "Select Cylinders"} options={getOptions("cylinders")} />
          </div>
          <div className="w-full">
            <FormikMultiDropdown name="horsepower" label={isArabic ? "القدرة الحصانية" : "HORSEPOWER"} placeholder={isArabic ? "اختر القدرة الحصانية" : "Select Horsepower"} options={getOptions("horsepower")} />
          </div>
      
          <div className="w-full">
            <FormikMultiDropdown name="seatingCapacity" label={isArabic ? "سعة المقاعد" : "SEATING CAPACITY"} placeholder={isArabic ? "اختر سعة المقاعد" : "Select Seating Capacity"} options={getOptions("seatingCapacity")} />
          </div>

          <div className="w-full">
            <FormikMultiDropdown name="color" label={isArabic ? "اللون الخارجي" : "EXTERIOR COLOR"} placeholder={isArabic ? "اختر اللون" : "Select Color"} options={getOptions("color")} />
          </div>
          <div className="w-full">
            <FormikMultiDropdown name="interiorColor" label={isArabic ? "اللون الداخلي" : "INTERIOR COLOR"} placeholder={isArabic ? "اختر اللون" : "Select Color"} options={getOptions("color")}/>
          </div>         
          <div className="w-full">
            <PillGroup name="transmissionType" label={isArabic ? "ناقل الحركة" : "TRANSMISSION"} options={getOptions("transmissionType").filter(t => t.value !== "semi-automatic")} />
          </div>
          {/* Condition Fields */}
          <div className="w-full">
            <MultiPillGroup name="insuredInUae" label={isArabic ? "هل سيارتك مؤمنة في الإمارات؟" : "Is your car insured in UAE?"} options={[
              { value: "yes", text: isArabic ? "نعم" : "Yes" }, { value: "no", text: isArabic ? "لا" : "No" }
            ]} />
          </div>
          <div className="w-full">
            <MultiPillGroup name="warranty" label={isArabic ? "الضمان" : "Warranty"} options={getOptions("warranty")} />
          </div>
          <div className="w-full">
            <MultiPillGroup name="fuelType" label={isArabic ? "نوع الوقود" : "Fuel Type"} options={getOptions("fuelType")} />
          </div>
          <div className="w-full">
            <MultiPillGroup name="doors" label={isArabic ? "الأبواب" : "Doors"} options={getOptions("doors")} />
          </div>
          <div className="w-full">
            <MultiPillGroup name="steeringSide" label={isArabic ? "جهة القيادة" : "Steering Side"} options={getOptions("steeringSide")} />
          </div>

          {/* Features Fields */}
          <div className="w-full md:col-span-2 lg:col-span-1">
             <FormikMultiDropdown name="driverAssistance" label={isArabic ? "مساعدة السائق والأمان" : "Driver Assistance & Safety"} placeholder={isArabic ? "اختر المواصفات" : "Select Features"} multiple options={getOptions("driverAssistance")} />
          </div>
          <div className="w-full">
            <FormikMultiDropdown name="entertainment" label={isArabic ? "الترفيه والتكنولوجيا" : "Entertainment & Technology"} placeholder={isArabic ? "اختر المواصفات" : "Select Features"} multiple options={getOptions("entertainment")} />
          </div>
          <div className="w-full">
            <FormikMultiDropdown name="comfort" label={isArabic ? "الراحة والملاءمة" : "Comfort & Convenience"} placeholder={isArabic ? "اختر المواصفات" : "Select Features"} multiple options={getOptions("comfort")} />
          </div>
          <div className="w-full">
            <FormikMultiDropdown name="exteriorFeatures" label={isArabic ? "التجهيزات الخارجية" : "Exterior"} placeholder={isArabic ? "اختر المواصفات" : "Select Features"} multiple options={getOptions("exteriorFeatures")} />
          </div>
        </div>
           {descriptionNode}
      </div>
    </div>
  );
};

export default CarSpecifications;
