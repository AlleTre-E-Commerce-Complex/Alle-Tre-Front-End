import React from "react";
import { useHistory } from "react-router-dom";
import { CreateAuctionBreadcrumb } from "../../../components/shared/bread-crumb/Breadcrumb";
import Stepper from "../../../components/shared/stepper/stepper-app";
import routes from "../../../routes";
import * as Yup from "yup";
import { Formik } from "formik";
import { Button, Form } from "semantic-ui-react";
import FormikInput from "../../../components/shared/formik/formik-input";
import FormikMultiDropdown from "../../../components/shared/formik/formik-dropdown";

const ProductDetails = () => {
  const history = useHistory();

  const ProductDetailsSchema = Yup.object({
    itemName: Yup.string().max(20).trim(),
    category: Yup.string().max(20).trim(),
    subCategory: Yup.string().max(20).trim(),
  });

  const handelProductDetailsdata = () => {};
  const stateOptions = [
    { key: "test", text: "test", value: "test" },
    { key: "test", text: "test", value: "test" },
  ];

  return (
    <div className="mt-44 animate-in ">
      <div className="mx-20 h-14 my-7 py-4 ">
        {/* Breadcrumb  */}
        <CreateAuctionBreadcrumb />
      </div>
      {/* stepper */}
      <div className="flex justify-center">
        <Stepper />
      </div>
      <div className="mx-16 ">
        <h1 className="text-black text-base font-bold mt-4">Item Details</h1>
        {/* formik */}
        <div>
          <Formik
            initialValues={{
              itemName: "",
              category: "",
              subCategory: "",
            }}
            onSubmit={handelProductDetailsdata}
            validationSchema={ProductDetailsSchema}
          >
            {(formik) => (
              <Form onSubmit={formik.handleSubmit}>
                <div className="grid gap-x-4 gap-y-10 grid-cols-4 mt-10">
                  <div className="col-span-2">
                    <FormikInput
                      name="itemName"
                      type={"text"}
                      label={"Item Name"}
                      placeholder="Item Name"
                    />
                  </div>
                  <div className="col-span-2"></div>
                  <div className="col-span-2">
                    <FormikMultiDropdown
                      name="category"
                      type={"text"}
                      label={"Category"}
                      placeholder="Category"
                      options={stateOptions}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormikMultiDropdown
                      name="subCategory"
                      type={"text"}
                      label={"Sub Category"}
                      placeholder="Sub Category"
                    />
                  </div>
                  <div className="w-full mt-1">
                    <FormikMultiDropdown
                      name="brand"
                      type={"text"}
                      label={"Brand"}
                      placeholder="Brand"
                    />
                  </div>
                  <div className="w-full mt-1">
                    <FormikMultiDropdown
                      name="model"
                      type={"text"}
                      label={"Model"}
                      placeholder="Model"
                    />
                  </div>
                  <div className="w-full mt-1">
                    <FormikMultiDropdown
                      name="color"
                      type={"text"}
                      label={"Color"}
                      placeholder="Color"
                    />
                  </div>
                  <div></div>
                  <div className="col-span-2 mt-2">
                    <FormikInput
                      name="itemDescription"
                      type={"text"}
                      label={"Item Description"}
                      placeholder="Item Description"
                    />
                  </div>
                </div>

                <div className="">
                  <Button
                    onClick={() => {}}
                    className="bg-primary  sm:w-[304px] w-full  h-[48px] rounded-lg text-white mt-8 font-normal text-base rtl:font-serifAR ltr:font-serifEN"
                  ></Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      {/* <button onClick={() => history.push(routes.createAuction.auctionDetails)}>
        go to auctionDetails
      </button> */}
    </div>
  );
};

export default ProductDetails;
