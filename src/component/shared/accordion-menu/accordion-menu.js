import React, { useState } from "react";
import { Accordion, Form, Menu } from "semantic-ui-react";
import { useLanguage } from "../../../context/language-context";
import useGetGatogry from "../../../hooks/use-get-category";
import content from "../../../localization/content";

const AccordionMenu = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const { GatogryOptions, loadingGatogry } = useGetGatogry();

  const Gatogry = (
    <Form className="">
      <Form.Group className="text-gray-med" grouped>
        {GatogryOptions?.map((e) => (
          <div key={e?.key}>
            <p className="py-1 cursor-pointer">{e?.text}</p>
          </div>
        ))}
      </Form.Group>
    </Form>
  );

  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <Accordion
      className="w-fit p-0 my-0 bg-secondary mx-4 text-white "
      as={Menu}
      vertical
    >
      <Menu.Item className="w-full p-0 m-0">
        <Accordion.Title
          className="text-white ltr:font-serifEN rtl:font-serifAR"
          active={activeIndex === 0}
          content="Categories"
          index={0}
          // onClick={handleClick}
        />
        <Accordion.Content active={activeIndex === 0} content={Gatogry} />
      </Menu.Item>
    </Accordion>
  );
};

export default AccordionMenu;
