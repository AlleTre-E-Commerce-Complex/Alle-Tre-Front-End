import React from "react";
import { Link, useLocation, u } from "react-router-dom";
import { Breadcrumb } from "semantic-ui-react";
import { useLanguage } from "../../../context/language-context";
import routes from "../../../routes";

export const CreateAuctionBreadcrumb = ({ edit }) => {
  const { pathname } = useLocation();
  const [lang, setLang] = useLanguage("");
  // const langContent = content[lang];

  const CreateAuctionSections = (pathname, edit) =>
    [
      {
        key: "Home",
        content: (
          <Link
            className="text-gray-med mx-2 text-base font-normal"
            to={routes.app.home}
          >
            Home
          </Link>
        ),
      },
      ...[
        pathname.startsWith(routes.createAuction.default) && {
          key: "Create Auction",
          content: (
            <Link
              className={`${
                pathname.startsWith(routes.createAuction.productDetails)
                  ? "text-gray-med"
                  : "text-primary"
              } mx-2 text-base font-normal `}
              to={routes.createAuction.default}
            >
              Create Auction
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.createAuction.productDetails) && {
          key: "Product Details",
          content: (
            <Link
              className={`${
                pathname.startsWith(routes.createAuction.auctionDetails)
                  ? "text-gray-med"
                  : "text-primary"
              } mx-2 text-base font-normal `}
              to={routes.createAuction.productDetails}
            >
              Product Details
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.createAuction.auctionDetails) && {
          key: "Shipping Details",
          content: (
            <Link
              className={`${
                pathname.startsWith(routes.createAuction.shippingDetails)
                  ? "text-gray-med"
                  : "text-primary"
              } mx-2 text-base font-normal `}
              to={routes.createAuction.auctionDetails}
            >
              Auction Details
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.createAuction.shippingDetails) && {
          key: "Shipping Details",
          content: (
            <Link
              className={`${
                pathname.startsWith(routes.createAuction.paymentDetails)
                  ? "text-gray-med"
                  : "text-primary"
              } mx-2 text-base font-normal `}
              to={routes.createAuction.shippingDetails}
            >
              Shipping Details
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.createAuction.paymentDetails) && {
          key: "Payment Details",
          content: (
            <Link
              className="text-primary mx-2 text-base font-normal"
              to={routes.createAuction.paymentDetails}
            >
              Payment Details
            </Link>
          ),
        },
      ],
    ].filter(Boolean);

  return (
    <Breadcrumb
      className="Edit_Breadcrumb"
      sections={CreateAuctionSections(pathname, edit)}
    />
  );
};
