import { Checkbox, Form } from "semantic-ui-react";
import "../../../../src/assets/style/checkbox-radio-group.css";
import useFilter from "../../../hooks/use-filter";

export const RadioButtonsFilter = ({ valueRadio, name, myRef }) => {
  const [filter, setFilter] = useFilter(name, "");

  return (
    <Form className="pt-5">
      {valueRadio?.map((e,index) => (
        <Form.Field key={index} className="">
          <Checkbox
            className="Edit_checkboxRadioGroup "
            radio
            label={e?.name}
            name="checkboxRadioGroup"
            value={e?.value}
            checked={e?.value === filter}
            onChange={(e, data) => {
              const newValue = data.value === filter ? "" : data.value;
              setFilter(newValue);
            }}
            onClick={() =>
              window.scrollTo({
                behavior: "smooth",
                top: myRef?.current?.offsetTop,
              })
            }
          />
        </Form.Field>
      ))}
    </Form>
  );
};
