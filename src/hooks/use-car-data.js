import { useMemo } from "react";
import carData from "../utils/car-data.json";
import { useLanguage } from "../context/language-context";

export const useCarData = (selectedMake, selectedModel) => {
  const [lang] = useLanguage();
  const isArabic = lang === "ar";

  const makes = useMemo(() => {
    return Object.keys(carData).map((make) => ({
      key: make,
      text: isArabic ? carData[make].nameAr : make,
      value: make,
    })).sort((a, b) => a.text.localeCompare(b.text));
  }, [isArabic]);

  const models = useMemo(() => {
    if (!selectedMake || !carData[selectedMake]) return [];
    
    return Object.keys(carData[selectedMake].models).map((model) => ({
      key: model,
      text: isArabic ? carData[selectedMake].models[model].nameAr : model,
      value: model,
    })).sort((a, b) => a.text.localeCompare(b.text));
  }, [selectedMake, isArabic]);

  const years = useMemo(() => {
    if (!selectedMake || !selectedModel || !carData[selectedMake]?.models[selectedModel]) return [];
    
    return carData[selectedMake].models[selectedModel].years.map((year) => ({
      key: year.toString(),
      text: year.toString(),
      value: year.toString(),
    }));
  }, [selectedMake, selectedModel]);

  return { makes, models, years };
};
