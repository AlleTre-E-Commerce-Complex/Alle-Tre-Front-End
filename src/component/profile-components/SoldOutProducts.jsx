import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import content from "../../localization/content";
import { useLanguage } from "../../context/language-context";
import { Dimmer } from "semantic-ui-react";
import { IoArchiveOutline } from "react-icons/io5";
import routes from "../../routes";
import PaginationApp from "../shared/pagination/pagination-app";
import useAxios from "../../hooks/use-axios";
import { authAxios } from "../../config/axios-config";
import api from "../../api";
import localizationKeys from "../../localization/localization-keys";
import LoadingTest3arbon from "../shared/lotties-file/loading-test-3arbon";
import ProductRowTable from "./product-row-table";

const SoldOutProducts = ({ OnReload }) => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => {
    setForceReload((p) => !p);
    if (OnReload) OnReload();
  }, [OnReload]);

  const [activeProductData, setActiveProductData] = useState();
  const [totalPages, setTotalPages] = useState();
  const [totalItems, setTotalItems] = useState();
  const { search } = useLocation();
  const { run, isLoading } = useAxios([]);
  useEffect(() => {
    if (search.includes("page") && search.includes("perPage"))
      run(
        authAxios
          .get(`${api.app.productListing.getAllListedProducts}${search}&status=SOLD_OUT&isMyListing=true`)
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
        <LoadingTest3arbon />
      </Dimmer>
      {activeProductData?.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-white dark:bg-[#1A1F2C] border border-gray-200 dark:border-[#2C3241] rounded-2xl p-8 mt-6 shadow-sm mx-auto w-full">
          <div className="bg-primary/10 dark:bg-primary/20 p-5 rounded-full mb-5">
            <IoArchiveOutline className="w-12 h-12 text-primary" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mt-2 text-sm font-medium">
            {
              selectedContent[
                localizationKeys.thereAreNoSoldOutProductsAtTheMoment
              ]
            }
          </p>
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
              Product_id={e?.product?.id}
              currency={e?.location?.country?.currency}
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
