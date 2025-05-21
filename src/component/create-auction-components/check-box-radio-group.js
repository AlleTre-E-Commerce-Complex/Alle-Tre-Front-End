import React from "react";

import { Form, Checkbox } from "semantic-ui-react";

import "../../../src/assets/style/checkbox-radio-group.css";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";

export const CheckboxRadioProductDetails = ({
  valueRadio,
  setRadioValue,
  categoryId,
  subCategoryId,
  isAuction
}) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const isProperty = categoryId === 3;
  const isAnimal = categoryId === 7;

  if ((isAnimal && subCategoryId === 23) || (isAnimal && isAuction)) {
    return null;
  }

  return (
    <Form className="flex md:flex-row flex-col gap-x-72">
      <Form.Field>
        <Checkbox
          className="Edit_checkboxRadioGroup"
          radio
          label={
            isProperty || (isAnimal && subCategoryId === 22)
              ? selectedContent[localizationKeys.sell]
              : selectedContent[localizationKeys.new]
          }
          name="checkboxRadioGroup"
          value="NEW"
          checked={valueRadio === "NEW"}
          onChange={(e, data) => setRadioValue(data.value)}
        />
        <p className="text-gray-med text-xs font-normal pt-3">
          {isProperty
            ? [localizationKeys.listYourPropertyForSale]
            : isAnimal && subCategoryId === 22
            ? selectedContent[localizationKeys.listYourAnimalForSale]
            : selectedContent[localizationKeys.getItNewFeeltheDifference]}
        </p>
      </Form.Field>
      <Form.Field>
        <Checkbox
          className="Edit_checkboxRadioGroup"
          radio
          label={
            isProperty
              ? selectedContent[localizationKeys.rent]
              : isAnimal && subCategoryId === 22
              ? selectedContent[localizationKeys.adoption]
              : selectedContent[localizationKeys.used]
          }
          name="checkboxRadioGroup"
          value="USED"
          checked={valueRadio === "USED"}
          onChange={(e, data) => setRadioValue(data.value)}
        />
        <p className="text-gray-med text-xs font-normal pt-3">
          {isProperty
            ? selectedContent[localizationKeys.listYourPropertyForRent]
            : isAnimal && subCategoryId === 22
            ? selectedContent[localizationKeys.listYourAnimalForAdoption]
            : selectedContent[localizationKeys.shopSustainableChoosePreOwned]}
        </p>
      </Form.Field>
      {/* <Form.Field>
        <Checkbox
          className="Edit_checkboxRadioGroup"
          radio
          label={selectedContent[localizationKeys.openBox]}
          name="checkboxRadioGroup"
          value="OPEN_BOX"
          checked={valueRadio === "OPEN_BOX"}
          onChange={(e, data) => setRadioValue(data.value)}
        />
        <p className="text-gray-med text-xs font-normal pt-3">
          Unwrap Incredible Savings with Open Box Items.
        </p>
      </Form.Field> */}
    </Form>
  );
};

export const CheckboxRadioAuctionDetails = ({ valueRadio, setRadioValue }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  return (
    <Form className="flex md:flex-row flex-col gap-x-64">
      <Form.Field>
        <Checkbox
          className="Edit_checkboxRadioGroup"
          radio
          label={selectedContent[localizationKeys.quickAuction]}
          name="checkboxRadioGroup"
          value="Quick Auction"
          checked={valueRadio === "Quick Auction"}
          onChange={(e, data) => setRadioValue(data.value)}
        />
        <p className="text-gray-med text-xs font-normal pt-2">
          {selectedContent[localizationKeys.maximumDurationMustBeDay]}
        </p>
      </Form.Field>
      <Form.Field>
        <Checkbox
          className="Edit_checkboxRadioGroup"
          radio
          label={selectedContent[localizationKeys.longAuction]}
          name="checkboxRadioGroup"
          value="Long Auction"
          checked={valueRadio === "Long Auction"}
          onChange={(e, data) => setRadioValue(data.value)}
        />
        <p className="text-gray-med text-xs font-normal pt-2">
          {
            selectedContent[
              localizationKeys.durationMoreThanOneDayFromStartingDate
            ]
          }
        </p>
      </Form.Field>
    </Form>
  );
};
