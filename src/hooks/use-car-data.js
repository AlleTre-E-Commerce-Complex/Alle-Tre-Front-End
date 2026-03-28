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
    if (!selectedMake) return [];
    
    const makesArray = Array.isArray(selectedMake) ? selectedMake : [selectedMake];
    const allModels = [];
    const seenModels = new Set();
    
    makesArray.forEach(make => {
      if (carData[make]) {
        Object.keys(carData[make].models).forEach(model => {
          if (!seenModels.has(model)) {
            const modelData = carData[make].models[model];
            allModels.push({
              key: model,
              text: isArabic ? modelData.nameAr : model,
              value: model,
            });
            seenModels.add(model);
          }
        });
      }
    });

    return allModels.sort((a, b) => a.text.localeCompare(b.text));
  }, [selectedMake, isArabic]);

  const years = useMemo(() => {
    if (!selectedMake || !selectedModel) return [];
    
    const makesArray = Array.isArray(selectedMake) ? selectedMake : [selectedMake];
    const modelsArray = Array.isArray(selectedModel) ? selectedModel : [selectedModel];
    
    // For years, we typically look at the first selected make and model that exists in data
    for (const make of makesArray) {
      for (const model of modelsArray) {
        if (carData[make]?.models[model]) {
          return carData[make].models[model].years.map((year) => ({
            key: year.toString(),
            text: year.toString(),
            value: year.toString(),
          }));
        }
      }
    }
    return [];
  }, [selectedMake, selectedModel]);

  return { makes, models, years };
};
