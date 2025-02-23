import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import content from "../../localization/content";
import { useLanguage } from "../../context/language-context";
import { Dimmer } from "semantic-ui-react";
import { ReactComponent as AuctionIcon } from "../../../src/assets/icons/Bids-icon.svg";
import routes from "../../routes";
import PaginationApp from "../shared/pagination/pagination-app";
import useAxios from "../../hooks/use-axios";
import { authAxios } from "../../config/axios-config";
import api from "../../api";
import localizationKeys from "../../localization/localization-keys";
import LodingTestAllatre from "../shared/lotties-file/loding-test-allatre";
import ProductRowTable from "./product-row-table";

const OutOfStockProducts = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);

  const [activeProductData, setActiveProductData] = useState();
  const [totalPages, setTotalPages] = useState();

  const { search } = useLocation();

  const [openIncreaseModel, setOpenIncreaseModel] = useState(false);
  const [auctionId, setAuctionId] = useState();
  const [compareValue, setCompareValue] = useState();

  const { run, isLoading } = useAxios([]);
  useEffect(() => {
    if (search.includes("page") && search.includes("perPage"))
      run(
        authAxios
          .get(`${api.app.productListing.getAllListedProducts}${search}&status=OUT_OF_STOCK`)
          .then((res) => {
            setActiveProductData(res?.data?.data);
            setTotalPages(res?.data?.pagination?.totalPages);
          })
      );
  }, [run, forceReload, search]);

  return (
    <div className="">
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50"
        active={isLoading}
        inverted
      >
        {/* <Loader active /> */}
        <LodingTestAllatre />
      </Dimmer>
      <div>
        <p className="pb-5 text-gray-med text-xs font-normal">
          {activeProductData?.length} {selectedContent[localizationKeys.total]}
        </p>
      </div>
      {activeProductData?.length === 0 ? (
        <div className="flex justify-center mt-32">
          <div>
            <AuctionIcon className="mx-auto" />
            <p className="text-gray-dark text-center mt-8 ">
              {
                selectedContent[
                  localizationKeys.youHaveNotPlacedAnyBidsAtThisTime
                ]
              }
            </p>
          </div>
        </div>
      ) : (
        <div>
          {activeProductData?.map((e) => (
            <ProductRowTable
              status={"OUT_OF_STOCK"}
              title={e?.product?.title}
              description={e?.product?.description}
              img={e?.product?.images[0]?.imageLink}
              price={e?.ProductListingPrice}
              goToDetails={routes.app.listProduct.details(e?.product?.id)}
              createdAt={e?.createdAt}
              onReload={onReload}
              productId={e?.id}

            />
          ))}
          <div className="flex justify-end mt-7 ltr:mr-2 rtl:ml-2">
            <PaginationApp totalPages={totalPages} perPage={5} />
          </div>
        </div>
      )}
    </div>
  );
};

export default OutOfStockProducts;
