import { useHistory, useLocation } from "react-router-dom";
import routes from "../../../routes";

const StepperApp = () => {
  const { pathname } = useLocation();
  const history = useHistory();

  return (
    <>
      {/* step 1 */}
      {pathname.length === 1 ||
        (pathname.endsWith(routes.app.createAuction.productDetails) && (
          <div className="flex mb-8 ">
            <div className="text-center relative">
              <button
                onClick={() =>
                  history.push(routes.app.createAuction.productDetails)
                }
                className="bg-primary w-8 h-8 rounded-full text-white text-center mx-2"
              >
                1
              </button>
              <p
                onClick={() =>
                  history.push(routes.app.createAuction.productDetails)
                }
                className="text-center text-xs font-normal absolute w-32 -left-10 mt-2 text-primary cursor-pointer"
              >
                Product Details
              </p>
            </div>
            <div className="border-gray-med border-dashed border-b-2 lg:lg:w-[332px] lg:w-[332px] md:w-[200px] w-[57px] my-auto"></div>
            <div className="relative">
              <button className="bg-gray-med w-8 h-8 rounded-full text-white text-center mx-2">
                2
              </button>
              <p className="text-center text-xs font-normal absolute w-32 -left-10 mt-2 text-gray cursor-pointer">
                Auction Details
              </p>
            </div>
            <div className="border-gray-med border-dashed border-b-2 lg:lg:w-[332px] lg:w-[332px] md:w-[200px] w-[57px] my-auto"></div>
            <div className="relative">
              <button className="bg-gray-med  w-8 h-8 rounded-full text-white text-center mx-2">
                3
              </button>
              <p className="text-center text-xs font-normal absolute w-32 -left-10 mt-2 text-gray cursor-pointer">
                Shipping Details
              </p>
            </div>
            {/* <div className="border-gray-med border-dashed border-b-2 lg:lg:w-[332px] lg:w-[332px] md:w-[200px] w-[57px] my-auto"></div>
            <div className="relative">
              <button className="bg-gray-med w-8 h-8 rounded-full text-white text-center mx-2">
                4
              </button>
              <p className="text-center text-xs font-normal absolute w-32 -left-10 mt-2 text-gray cursor-pointer">
                Payment Details
              </p>
            </div> */}
          </div>
        ))}

      {/* step 2 */}
      {pathname.length === 1 ||
        (pathname.endsWith(routes.app.createAuction.auctionDetails) && (
          <div className="flex mb-8">
            <div className="text-center relative">
              <button
                onClick={() =>
                  history.push(routes.app.createAuction.productDetails)
                }
                className="bg-primary w-8 h-8 rounded-full text-white text-center mx-2"
              >
                1
              </button>
              <p className="text-center text-xs font-normal absolute w-32 -left-10 mt-2 text-primary cursor-pointer">
                Product Details
              </p>
            </div>
            <div className="border-primary border-dashed border-b-2 lg:w-[332px] md:w-[200px] w-[57px] my-auto"></div>
            <div className="text-center relative">
              <button
                onClick={() =>
                  history.push(routes.app.createAuction.auctionDetails)
                }
                className="bg-primary  w-8 h-8 rounded-full text-white text-center mx-2"
              >
                2
              </button>
              <p className="text-center text-xs font-normal absolute w-32 -left-10 mt-2 text-primary cursor-pointer">
                Auction Details
              </p>
            </div>
            <div className="border-gray-med border-dashed border-b-2 lg:w-[332px] md:w-[200px] w-[57px] my-auto"></div>
            <div className="relative">
              <button className="bg-gray-med  w-8 h-8 rounded-full text-white text-center mx-2">
                3
              </button>
              <p className="text-center text-xs font-normal absolute w-32 -left-10 mt-2 text-gray cursor-pointer">
                Shipping Details
              </p>
            </div>
            {/* <div className="border-gray-med border-dashed border-b-2 lg:w-[332px] md:w-[200px] w-[57px] my-auto"></div>
            <div className="relative">
              <button className="bg-gray-med w-8 h-8 rounded-full text-white text-center mx-2">
                4
              </button>
              <p className="text-center text-xs font-normal absolute w-32 -left-10 mt-2 text-gray cursor-pointer">
                Payment Details
              </p>
            </div> */}
          </div>
        ))}

      {/* step 3 */}
      {pathname.length === 1 ||
        (pathname.endsWith(routes.app.createAuction.shippingDetails) && (
          <div className="flex mb-8">
            <div className="text-center relative">
              <button
                onClick={() =>
                  history.push(routes.app.createAuction.productDetails)
                }
                className="bg-primary w-8 h-8 rounded-full text-white text-center mx-2"
              >
                1
              </button>
              <p
                onClick={() =>
                  history.push(routes.app.createAuction.productDetails)
                }
                className="text-center text-xs font-normal absolute w-32 -left-10 mt-2 text-primary cursor-pointer"
              >
                Product Details
              </p>
            </div>
            <div className="border-primary border-dashed border-b-2 lg:w-[332px] md:w-[200px] w-[57px] my-auto"></div>
            <div className="text-center relative">
              <button
                onClick={() =>
                  history.push(routes.app.createAuction.auctionDetails)
                }
                className="bg-primary  w-8 h-8 rounded-full text-white text-center mx-2"
              >
                2
              </button>
              <p
                onClick={() =>
                  history.push(routes.app.createAuction.auctionDetails)
                }
                className="text-center text-xs font-normal absolute w-32 -left-10 mt-2 text-primary cursor-pointer"
              >
                Auction Details
              </p>
            </div>

            <div className="border-primary border-dashed border-b-2 lg:w-[332px] md:w-[200px] w-[57px] my-auto"></div>
            <div className="text-center relative">
              <button
                onClick={() =>
                  history.push(routes.app.createAuction.shippingDetails)
                }
                className="bg-primary  w-8 h-8 rounded-full text-white text-center mx-2"
              >
                3
              </button>
              <p className="text-center text-xs font-normal absolute w-32 -left-10 mt-2 text-primary cursor-pointer">
                Shipping Details
              </p>
            </div>

            {/* <div className="border-gray-med border-dashed border-b-2 lg:w-[332px] md:w-[200px] w-[57px] my-auto"></div>
            <div className="text-center relative">
              <button className="bg-gray-med w-8 h-8 rounded-full text-white text-center mx-2">
                4
              </button>
              <p className="text-center text-xs font-normal absolute w-32 -left-10 mt-2  text-gray-med  cursor-pointer">
                Payment Details
              </p>
            </div> */}
          </div>
        ))}

      {/* step 4 */}
      {pathname.length === 1 ||
        (pathname.endsWith(routes.app.createAuction.paymentDetails) && (
          <div className="flex">
            <div className="text-center relative">
              <button
                onClick={() =>
                  history.push(routes.app.createAuction.productDetails)
                }
                className="bg-primary w-8 h-8 rounded-full text-white text-center mx-2"
              >
                1
              </button>
              <p
                onClick={() =>
                  history.push(routes.app.createAuction.productDetails)
                }
                className="text-center text-xs font-normal absolute w-32 -left-10 mt-2 text-primary cursor-pointer"
              >
                Product Details
              </p>
            </div>

            <div className="border-primary border-dashed border-b-2 lg:w-[332px] md:w-[200px] w-[57px] my-auto"></div>

            <div className="text-center relative">
              <button
                onClick={() =>
                  history.push(routes.app.createAuction.auctionDetails)
                }
                className="bg-primary  w-8 h-8 rounded-full text-white text-center mx-2"
              >
                2
              </button>
              <p
                onClick={() =>
                  history.push(routes.app.createAuction.auctionDetails)
                }
                className="text-center text-xs font-normal absolute w-32 -left-10 mt-2 text-primary cursor-pointer"
              >
                Auction Details
              </p>
            </div>

            <div className="border-primary border-dashed border-b-2 lg:w-[332px] md:w-[200px] w-[57px] my-auto"></div>

            <div className="text-center relative">
              <button
                onClick={() =>
                  history.push(routes.app.createAuction.shippingDetails)
                }
                className="bg-primary  w-8 h-8 rounded-full text-white text-center mx-2"
              >
                3
              </button>
              <p
                onClick={() =>
                  history.push(routes.app.createAuction.shippingDetails)
                }
                className="text-center text-xs font-normal absolute w-32 -left-10 mt-2 text-primary cursor-pointer"
              >
                Shipping Details
              </p>
            </div>

            <div className="border-primary border-dashed border-b-2 lg:w-[332px] md:w-[200px] w-[57px] my-auto"></div>

            {/* <div className="text-center relative">
              <button
                onClick={() =>
                  history.push(routes.app.createAuction.paymentDetails)
                }
                className="bg-primary  w-8 h-8 rounded-full text-white text-center mx-2"
              >
                3
              </button>
              <p
                onClick={() =>
                  history.push(routes.createAuction.paymentDetails)
                }
                className="text-center text-xs font-normal absolute w-32 -left-10 mt-2 text-primary cursor-pointer"
              >
                Payment Details
              </p>
            </div> */}
          </div>
        ))}
    </>
  );
};

export default StepperApp;
