import React from "react";

import { Form, Checkbox } from "semantic-ui-react";

import "../../../src/assets/style/checkbox-radio-group.css";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";

export const CheckboxRadioProductDetails = ({ valueRadio, setRadioValue }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  return (
    <Form className="flex md:flex-row flex-col gap-x-72">
      <Form.Field>
        <Checkbox
          className="Edit_checkboxRadioGroup"
          radio
          label={selectedContent[localizationKeys.new]}
          name="checkboxRadioGroup"
          value="NEW"
          checked={valueRadio === "NEW"}
          onChange={(e, data) => setRadioValue(data.value)}
        />
        <p className="text-gray-med text-xs font-normal pt-3">
          Get It New, Feel the Difference.
        </p>
      </Form.Field>
      <Form.Field>
        <Checkbox
          className="Edit_checkboxRadioGroup"
          radio
          label={selectedContent[localizationKeys.used]}
          name="checkboxRadioGroup"
          value="USED"
          checked={valueRadio === "USED"}
          onChange={(e, data) => setRadioValue(data.value)}
        />
        <p className="text-gray-med text-xs font-normal pt-3">
          Shop Sustainable: Choose Pre-Owned.
        </p>
      </Form.Field>
      <Form.Field>
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
      </Form.Field>
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
