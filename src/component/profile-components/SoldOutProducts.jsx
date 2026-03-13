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

const SoldOutProducts = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);

  const [activeProductData, setActiveProductData] = useState();
  const [totalPages, setTotalPages] = useState();
  const [totalItems, setTotalItems] = useState();
  const { search } = useLocation();
  const { run, isLoading } = useAxios([]);
  useEffect(() => {
    if (search.includes("page") && search.includes("perPage"))
      run(
        authAxios
          .get(`${api.app.productListing.getAllListedProducts}${search}&status=SOLD_OUT`)
          .then((res) => {
            setActiveProductData(res?.data?.data);
            setTotalPages(res?.data?.pagination?.totalPages);
            setTotalItems(res?.data?.pagination?.totalItems);
          })
      );
  }, [run, forceReload, search]);

  return (
    <div className="mt-4">
      <Dimmer
        className="fixed w-full h-full top-0 bg-white/50 dark:bg-[#151A23]/50"
        active={isLoading}
        inverted
      >
        <LodingTestAllatre />
      </Dimmer>
      {activeProductData?.length === 0 ? (
        <div className="flex justify-center mt-32">
          <div>
            <AuctionIcon className="mx-auto" />
            <p className="text-gray-dark dark:text-gray-400 text-center mt-8 ">
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
              key={e?.id}
              status={"SOLD_OUT"}
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
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 sm:mb-0">
              {selectedContent[localizationKeys.showing]} {activeProductData?.length || 0} {totalItems ? ` ${selectedContent[localizationKeys.of]} ${totalItems}` : ""} {selectedContent[localizationKeys.products]}
            </p>
            <PaginationApp totalPages={totalPages} perPage={10} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SoldOutProducts;
