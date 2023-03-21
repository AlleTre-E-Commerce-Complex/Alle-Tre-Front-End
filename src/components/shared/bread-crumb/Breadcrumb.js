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
        pathname.startsWith(routes.app.createAuction.default) && {
          key: "Create Auction",
          content: (
            <Link
              className={`${
                pathname.startsWith(routes.app.createAuction.productDetails)
                  ? "text-gray-med"
                  : "text-primary"
              } mx-2 text-base font-normal `}
              to={routes.app.createAuction.default}
            >
              Create Auction
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.app.createAuction.productDetails) && {
          key: "Product Details",
          content: (
            <Link
              className={`${
                pathname.startsWith(routes.app.createAuction.auctionDetails)
                  ? "text-gray-med"
                  : "text-primary"
              } mx-2 text-base font-normal `}
              to={routes.app.createAuction.productDetails}
            >
              Product Details
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.app.createAuction.auctionDetails) && {
          key: "Shipping Details",
          content: (
            <Link
              className={`${
                pathname.startsWith(routes.app.createAuction.shippingDetails)
                  ? "text-gray-med"
                  : "text-primary"
              } mx-2 text-base font-normal `}
              to={routes.app.createAuction.auctionDetails}
            >
              Auction Details
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.app.createAuction.shippingDetails) && {
          key: "Shipping Details",
          content: (
            <Link
              className={`${
                pathname.startsWith(routes.app.createAuction.paymentDetails)
                  ? "text-gray-med"
                  : "text-primary"
              } mx-2 text-base font-normal `}
              to={routes.app.createAuction.shippingDetails}
            >
              Shipping Details
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.app.createAuction.paymentDetails) && {
          key: "Payment Details",
          content: (
            <Link
              className="text-primary mx-2 text-base font-normal"
              to={routes.app.createAuction.paymentDetails}
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

export const AuctionDetailsBreadcrumb = ({ details }) => {
  const { pathname } = useLocation();
  const [lang, setLang] = useLanguage("");
  // const langContent = content[lang];

  const AuctionDetailsSections = (pathname, details) =>
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
        pathname.startsWith(routes.app.profile.default) && {
          key: "profile",
          content: (
            <Link
              className={`${
                pathname.startsWith(routes.app.profile.default)
                  ? "text-gray-med"
                  : "text-primary"
              } mx-2 text-base font-normal `}
              to={routes.app.profile.default}
            >
              Profile
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.app.profile.myAuctions.default) && {
          key: "My Auctions",
          content: (
            <Link
              className={`${
                pathname.startsWith(routes.app.profile.myAuctions.default)
                  ? "text-gray-med"
                  : "text-primary"
              } mx-2 text-base font-normal `}
              to={routes.app.profile.myAuctions.default}
            >
              My Auctions
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.app.profile.myAuctions.active) && {
          key: " Active Auctions",
          content: (
            <Link
              className={`${
                pathname.startsWith(routes.app.profile.myAuctions.active)
                  ? "text-gray-med"
                  : "text-primary"
              } mx-2 text-base font-normal `}
              to={routes.app.profile.myAuctions.active}
            >
              Active Auctions
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.app.profile.myAuctions.scheduled) && {
          key: "Scheduled Auctions",
          content: (
            <Link
              className={`${
                pathname.startsWith(routes.app.profile.myAuctions.scheduled)
                  ? "text-gray-med"
                  : "text-primary"
              } mx-2 text-base font-normal `}
              to={routes.app.profile.myAuctions.scheduled}
            >
              Scheduled Auctions
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.app.profile.myAuctions.sold) && {
          key: "Sold Auctions",
          content: (
            <Link
              className={`${
                pathname.startsWith(routes.app.profile.myAuctions.sold)
                  ? "text-gray-med"
                  : "text-primary"
              } mx-2 text-base font-normal `}
              to={routes.app.profile.myAuctions.sold}
            >
              Sold Auctions
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.app.profile.myAuctions.pending) && {
          key: "Pending Auctions",
          content: (
            <Link
              className={`${
                pathname.startsWith(routes.app.profile.myAuctions.pending)
                  ? "text-gray-med"
                  : "text-primary"
              } mx-2 text-base font-normal `}
              to={routes.app.profile.myAuctions.pending}
            >
              Pending Auctions
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.app.profile.myAuctions.expired) && {
          key: "Expired Auctions",
          content: (
            <Link
              className={`${
                pathname.startsWith(routes.app.profile.myAuctions.expired)
                  ? "text-gray-med"
                  : "text-primary"
              } mx-2 text-base font-normal `}
              to={routes.app.profile.myAuctions.expired}
            >
              Expired Auctions
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(
          routes.app.profile.myAuctions.activeDetails(details)
        ) && {
          key: "View Details",
          content: (
            <Link
              className={`${
                pathname.startsWith(
                  routes.app.profile.myAuctions.activeDetails(details)
                )
                  ? "text-primary"
                  : "text-gray-med"
              } mx-2 text-base font-normal `}
              to={routes.app.profile.myAuctions.activeDetails(details)}
            >
              View Details
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(
          routes.app.profile.myAuctions.scheduledDetails(details)
        ) && {
          key: "View Details",
          content: (
            <Link
              className={`${
                pathname.startsWith(
                  routes.app.profile.myAuctions.scheduledDetails(details)
                )
                  ? "text-primary"
                  : "text-gray-med"
              } mx-2 text-base font-normal `}
              to={routes.app.profile.myAuctions.scheduledDetails(details)}
            >
              View Details
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(
          routes.app.profile.myAuctions.soldDetails(details)
        ) && {
          key: "View Details",
          content: (
            <Link
              className={`${
                pathname.startsWith(
                  routes.app.profile.myAuctions.soldDetails(details)
                )
                  ? "text-primary"
                  : "text-gray-med"
              } mx-2 text-base font-normal `}
              to={routes.app.profile.myAuctions.soldDetails(details)}
            >
              View Details
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(
          routes.app.profile.myAuctions.pendingDetails(details)
        ) && {
          key: "View Details",
          content: (
            <Link
              className={`${
                pathname.startsWith(
                  routes.app.profile.myAuctions.pendingDetails(details)
                )
                  ? "text-primary"
                  : "text-gray-med"
              } mx-2 text-base font-normal `}
              to={routes.app.profile.myAuctions.pendingDetails(details)}
            >
              View Details
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(
          routes.app.profile.myAuctions.expiredDetails(details)
        ) && {
          key: "View Details",
          content: (
            <Link
              className={`${
                pathname.startsWith(
                  routes.app.profile.myAuctions.expiredDetails(details)
                )
                  ? "text-primary"
                  : "text-gray-med"
              } mx-2 text-base font-normal `}
              to={routes.app.profile.myAuctions.expiredDetails(details)}
            >
              View Details
            </Link>
          ),
        },
      ],
    ].filter(Boolean);

  return (
    <Breadcrumb
      className="Edit_Breadcrumb"
      sections={AuctionDetailsSections(pathname, details)}
    />
  );
};
