import React from "react";
import { Link, useLocation, u } from "react-router-dom";
import { Breadcrumb } from "semantic-ui-react";
import { useLanguage } from "../../../context/language-context";
import routes from "../../../routes";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";

export const CreateAuctionBreadcrumb = ({ edit }) => {
  const { pathname } = useLocation();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const CreateAuctionSections = (pathname, edit) =>
    [
      {
        key: "Home",
        content: (
          <Link
            className="text-gray-med mx-2 text-base font-normal"
            to={routes.app.home}
          >
            {selectedContent[localizationKeys.home]}
          </Link>
        ),
      },
      ...[
        pathname.startsWith(routes.app.createAuction.default) && {
          key: "Create Auction",
          content: (
            <Link
              className={`${pathname.startsWith(routes.app.createAuction.productDetails)
                  ? "text-gray-med"
                  : "text-primary"
                } mx-2 text-base font-normal `}
              to={routes.app.createAuction.default}
            >
              {selectedContent[localizationKeys.createAuction]}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.app.createAuction.productDetails) && {
          key: "Product Details",
          content: (
            <Link
              className={`${pathname.startsWith(routes.app.createAuction.auctionDetails)
                  ? "text-gray-med"
                  : "text-primary"
                } mx-2 text-base font-normal `}
            // to={routes.app.createAuction.productDetails}
            >
              {selectedContent[localizationKeys.productDetails]}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.app.createAuction.auctionDetails) && {
          key: "Shipping Details",
          content: (
            <Link
              className={`${pathname.startsWith(routes.app.createAuction.shippingDetails)
                  ? "text-gray-med"
                  : "text-primary"
                } mx-2 text-base font-normal `}
            // to={routes.app.createAuction.auctionDetails}
            >
              {selectedContent[localizationKeys.auctionDetails]}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.app.createAuction.shippingDetails) && {
          key: "Shipping Details",
          content: (
            <Link
              className={`${pathname.startsWith(routes.app.createAuction.paymentDetails)
                  ? "text-gray-med"
                  : "text-primary"
                } mx-2 text-base font-normal `}
            // to={routes.app.createAuction.shippingDetails}
            >
              {selectedContent[localizationKeys.shippingDetails]}
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
              {selectedContent[localizationKeys.paymentDetails]}
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
  const selectedContent = content[lang];

  const AuctionDetailsSections = (pathname, details) =>
    [
      {
        key: "Home",
        content: (
          <Link
            className="text-gray-med mx-2 text-base font-normal"
            to={routes.app.home}
          >
            {selectedContent[localizationKeys.home]}
          </Link>
        ),
      },
      ...[
        pathname.startsWith(routes.app.profile.default) && {
          key: "profile",
          content: (
            <Link
              className={`${pathname.startsWith(routes.app.profile.default)
                  ? "text-gray-med"
                  : "text-primary"
                } mx-2 text-base font-normal `}
              to={routes.app.profile.default}
            >
              {selectedContent[localizationKeys.profile]}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.app.profile.myAuctions.default) && {
          key: "My Auctions",
          content: (
            <Link
              className={`${pathname.startsWith(routes.app.profile.myAuctions.default)
                  ? "text-gray-med"
                  : "text-primary"
                } mx-2 text-base font-normal `}
              to={routes.app.profile.myAuctions.default}
            >
              {selectedContent[localizationKeys.myAuctions]}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.app.profile.myAuctions.active) && {
          key: " Active Auctions",
          content: (
            <Link
              className={`${pathname.startsWith(routes.app.profile.myAuctions.active)
                  ? "text-gray-med"
                  : "text-primary"
                } mx-2 text-base font-normal `}
              to={routes.app.profile.myAuctions.active}
            >
              {selectedContent[localizationKeys.activeAuctions]}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.app.profile.myAuctions.scheduled) && {
          key: "Scheduled Auctions",
          content: (
            <Link
              className={`${pathname.startsWith(routes.app.profile.myAuctions.scheduled)
                  ? "text-gray-med"
                  : "text-primary"
                } mx-2 text-base font-normal `}
              to={routes.app.profile.myAuctions.scheduled}
            >
              {selectedContent[localizationKeys.scheduledAuctions]}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.app.profile.myAuctions.sold) && {
          key: "Sold Auctions",
          content: (
            <Link
              className={`${pathname.startsWith(routes.app.profile.myAuctions.sold)
                  ? "text-gray-med"
                  : "text-primary"
                } mx-2 text-base font-normal `}
              to={routes.app.profile.myAuctions.sold}
            >
              {selectedContent[localizationKeys.soldAuctions]}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.app.profile.myAuctions.pending) && {
          key: "Pending Auctions",
          content: (
            <Link
              className={`${pathname.startsWith(routes.app.profile.myAuctions.pending)
                  ? "text-gray-med"
                  : "text-primary"
                } mx-2 text-base font-normal `}
              to={routes.app.profile.myAuctions.pending}
            >
              {selectedContent[localizationKeys.pendingAuctions]}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.app.profile.myAuctions.expired) && {
          key: "Expired Auctions",
          content: (
            <Link
              className={`${pathname.startsWith(routes.app.profile.myAuctions.expired)
                  ? "text-gray-med"
                  : "text-primary"
                } mx-2 text-base font-normal `}
              to={routes.app.profile.myAuctions.expired}
            >
              {selectedContent[localizationKeys.expiredAuctions]}
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
              className={`${pathname.startsWith(
                routes.app.profile.myAuctions.activeDetails(details)
              )
                  ? "text-primary"
                  : "text-gray-med"
                } mx-2 text-base font-normal `}
              to={routes.app.profile.myAuctions.activeDetails(details)}
            >
              {selectedContent[localizationKeys.viewDetails]}
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
              className={`${pathname.startsWith(
                routes.app.profile.myAuctions.scheduledDetails(details)
              )
                  ? "text-primary"
                  : "text-gray-med"
                } mx-2 text-base font-normal `}
              to={routes.app.profile.myAuctions.scheduledDetails(details)}
            >
              {selectedContent[localizationKeys.viewDetails]}
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
              className={`${pathname.startsWith(
                routes.app.profile.myAuctions.soldDetails(details)
              )
                  ? "text-primary"
                  : "text-gray-med"
                } mx-2 text-base font-normal `}
              to={routes.app.profile.myAuctions.soldDetails(details)}
            >
              {selectedContent[localizationKeys.viewDetails]}
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
              className={`${pathname.startsWith(
                routes.app.profile.myAuctions.pendingDetails(details)
              )
                  ? "text-primary"
                  : "text-gray-med"
                } mx-2 text-base font-normal `}
              to={routes.app.profile.myAuctions.pendingDetails(details)}
            >
              {selectedContent[localizationKeys.viewDetails]}
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
              className={`${pathname.startsWith(
                routes.app.profile.myAuctions.expiredDetails(details)
              )
                  ? "text-primary"
                  : "text-gray-med"
                } mx-2 text-base font-normal `}
              to={routes.app.profile.myAuctions.expiredDetails(details)}
            >
              {selectedContent[localizationKeys.viewDetails]}
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

export const AuctionHomeDetailsBreadcrumb = ({ details, category }) => {
  const { pathname } = useLocation();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const AuctionHomeDetailsSections = (pathname, details, category) =>
    [
      {
        key: "home",
        content: (
          <Link
            className="text-gray-med mx-2 text-base font-normal"
            to={routes.app.home}
          >
            {selectedContent[localizationKeys.home]}
          </Link>
        ),
      },
      {
        key: "category",
        content: (
          <Link
            className="text-gray-med mx-2 text-base font-normal"
            to={routes.app.categories(category)}
          >
            {category}
          </Link>
        ),
      },
      ...[
        pathname.startsWith(routes.app.homeDetails(details)) && {
          key: "Auction Details",
          content: (
            <Link
              className={`${pathname.startsWith(routes.app.homeDetails(details)) &&
                  pathname.startsWith(routes.app.buyNow(details))
                  ? "text-gray-med"
                  : "text-primary"
                } mx-2 text-base font-normal `}
              to={routes.app.homeDetails(details)}
            >
              {selectedContent[localizationKeys.auctionDetails]}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.app.payDeposite(details)) && {
          key: "Pay Deposite",
          content: (
            <Link
              className={`${pathname.startsWith(routes.app.payDeposite(details))
                  ? "text-primary"
                  : "text-gray-med"
                } mx-2 text-base font-normal `}
              to={routes.app.payDeposite(details)}
            >
              {selectedContent[localizationKeys.payDeposite]}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.app.buyNow(details)) && {
          key: "buy now",
          content: (
            <Link
              className={`${pathname.startsWith(routes.app.buyNow(details))
                  ? "text-primary"
                  : "text-gray-med"
                } mx-2 text-base font-normal `}
              to={routes.app.buyNow(details)}
            >
              {selectedContent[localizationKeys.buyNow]}
            </Link>
          ),
        },
      ],
    ].filter(Boolean);

  return (
    <Breadcrumb
      className="Edit_Breadcrumb"
      sections={AuctionHomeDetailsSections(pathname, details, category)}
    />
  );
};

export const MyBidsBreadcrumb = ({ details, category }) => {
  const { pathname } = useLocation();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const MyBidsSections = (pathname, details, category) =>
    [ {
      key: "home",
      content: (
        <Link
          className="text-gray-med mx-2 text-base font-normal"
          to={routes.app.home}
        >
          {selectedContent[localizationKeys.home]}
        </Link>
      ),
    },
    {
      key: "category",
      content: (
        <Link
          className="text-gray-med mx-2 text-base font-normal"
          to={routes.app.categories(category)}
        >
          {category}
        </Link>
      ),
    },
      {
        key: "category",
        content: (
          <Link
            className="text-gray-med mx-2 text-base font-normal"
            to={routes.app.categories()}
          >
            {selectedContent[localizationKeys.category]}
          </Link>
        ),
      },
      ...[
        pathname.startsWith(routes.app.profile.default) && {
          key: "Auction Details",
          content: (
            <Link
              className={`${pathname.startsWith(routes.app.profile.default)
                  ? "text-gray-med"
                  : "text-primary"
                } mx-2 text-base font-normal `}
              to={routes.app.profile.default}
            >
              {selectedContent[localizationKeys.profile]}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.app.profile.myBids.default) && {
          key: "My Bids",
          content: (
            <Link
              className={`${pathname.startsWith(routes.app.profile.myBids.default)
                  ? "text-gray-med"
                  : "text-primary"
                } mx-2 text-base font-normal `}
              to={routes.app.profile.myBids.default}
            >
              {selectedContent[localizationKeys.myBids]}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.app.profile.myBids.inPogress) && {
          key: "  In Pogress",
          content: (
            <Link
              className={`${pathname.startsWith(routes.app.profile.myBids.inPogress)
                  ? "text-gray-med"
                  : "text-primary"
                } mx-2 text-base font-normal `}
              to={routes.app.profile.myBids.inPogress}
            >
              {selectedContent[localizationKeys.inProgress]}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.app.profile.myBids.pending) && {
          key: "Pending",
          content: (
            <Link
              className={`${pathname.startsWith(routes.app.profile.myBids.pending)
                  ? "text-gray-med"
                  : "text-primary"
                } mx-2 text-base font-normal `}
              to={routes.app.profile.myBids.pending}
            >
              {selectedContent[localizationKeys.pending]}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.app.profile.myBids.waitingForDelivery) && {
          key: " Waiting For Delivery",
          content: (
            <Link
              className={`${pathname.startsWith(
                routes.app.profile.myBids.waitingForDelivery
              )
                  ? "text-gray-med"
                  : "text-primary"
                } mx-2 text-base font-normal `}
              to={routes.app.profile.myBids.waitingForDelivery}
            >
              {selectedContent[localizationKeys.waitingForDelivery]}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.app.profile.myBids.expired) && {
          key: "Expired",
          content: (
            <Link
              className={`${pathname.startsWith(routes.app.profile.myBids.expired)
                  ? "text-gray-med"
                  : "text-primary"
                } mx-2 text-base font-normal `}
              to={routes.app.profile.myBids.expired}
            >
              {selectedContent[localizationKeys.expired]}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.app.profile.myBids.completed) && {
          key: "completed",
          content: (
            <Link
              className={`${pathname.startsWith(routes.app.profile.myBids.completed)
                  ? "text-gray-med"
                  : "text-primary"
                } mx-2 text-base font-normal `}
              to={routes.app.profile.myBids.completed}
            >
              {selectedContent[localizationKeys.completed]}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.app.profile.myBids.completePayment) && {
          key: " Complete Payment",
          content: (
            <Link
              className={`${pathname.startsWith(routes.app.profile.myBids.completePayment)
                  ? "text-primary"
                  : "text-gray-med"
                } mx-2 text-base font-normal `}
              to={routes.app.profile.myBids.completePayment}
            >
              {selectedContent[localizationKeys.completePayment]}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(
          routes.app.profile.myBids.inPogressDetails(details)
        ) && {
          key: "View Details",
          content: (
            <Link
              className={`${pathname.startsWith(
                routes.app.profile.myBids.inPogressDetails(details)
              )
                  ? "text-primary"
                  : "text-gray-med"
                } mx-2 text-base font-normal `}
              to={routes.app.profile.myBids.inPogressDetails(details)}
            >
              {selectedContent[localizationKeys.viewDetails]}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(
          routes.app.profile.myBids.pendingDetails(details)
        ) && {
          key: "View Details",
          content: (
            <Link
              className={`${pathname.startsWith(
                routes.app.profile.myBids.pendingDetails(details)
              )
                  ? "text-primary"
                  : "text-gray-med"
                } mx-2 text-base font-normal `}
              to={routes.app.profile.myBids.pendingDetails(details)}
            >
              {selectedContent[localizationKeys.viewDetails]}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(
          routes.app.profile.myBids.waitingForDeliveryDetails(details)
        ) && {
          key: "View Details",
          content: (
            <Link
              className={`${pathname.startsWith(
                routes.app.profile.myBids.waitingForDeliveryDetails(details)
              )
                  ? "text-primary"
                  : "text-gray-med"
                } mx-2 text-base font-normal `}
              to={routes.app.profile.myBids.waitingForDeliveryDetails(details)}
            >
              {selectedContent[localizationKeys.viewDetails]}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(
          routes.app.profile.myBids.expiredDetails(details)
        ) && {
          key: "View Details",
          content: (
            <Link
              className={`${pathname.startsWith(
                routes.app.profile.myBids.expiredDetails(details)
              )
                  ? "text-primary"
                  : "text-gray-med"
                } mx-2 text-base font-normal `}
              to={routes.app.profile.myBids.expiredDetails(details)}
            >
              {selectedContent[localizationKeys.viewDetails]}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(
          routes.app.profile.myBids.completedDetails(details)
        ) && {
          key: "View Details",
          content: (
            <Link
              className={`${pathname.startsWith(
                routes.app.profile.myBids.completedDetails(details)
              )
                  ? "text-primary"
                  : "text-gray-med"
                } mx-2 text-base font-normal `}
              to={routes.app.profile.myBids.completedDetails(details)}
            >
              {selectedContent[localizationKeys.viewDetails]}
            </Link>
          ),
        },
      ],
    ].filter(Boolean);

  return (
    <Breadcrumb
      className="Edit_Breadcrumb"
      sections={MyBidsSections(pathname, details, category)}
    />
  );
};

export const FAQsBreadcrumb = ({ details }) => {
  const { pathname } = useLocation();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const FAQsSections = (pathname, details) =>
    [
      {
        key: "Home",
        content: (
          <Link
            className="text-gray-med mx-2 text-base font-normal"
            to={routes.app.home}
          >
            {selectedContent[localizationKeys.home]}
          </Link>
        ),
      },
      ...[
        pathname.startsWith(routes.app.faqs) && {
          key: "Auction Details",
          content: (
            <Link
              className={`${pathname.startsWith(routes.app.faqs)
                  ? "text-primary"
                  : "text-gray-med"
                } mx-2 text-base font-normal `}
              to={routes.app.faqs}
            >
              {selectedContent[localizationKeys.faqs]}
            </Link>
          ),
        },
      ],
    ].filter(Boolean);

  return (
    <Breadcrumb
      className="Edit_Breadcrumb"
      sections={FAQsSections(pathname, details)}
    />
  );
};

export const ListProductsBreadcrumb = ({ details, category }) => {
  const { pathname } = useLocation();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const ListProductSections = (pathname, details, category) =>
    [
      {
        key: "home",
        content: (
          <Link
            className="text-gray-med mx-2 text-base font-normal"
            to={routes.app.home}
          >
            {selectedContent[localizationKeys.home]}
          </Link>
        ),
      },
      {
        key: "category",
        content: (
          <Link
            className="text-gray-med mx-2 text-base font-normal"
            to={routes.app.categories(category)}
          >
            {category}
          </Link>
        ),
      },
      ...[
        pathname.startsWith(routes.app.listProduct.details(details)) && {
          key: "category",
          content: (
            <Link
              className={`${pathname.startsWith(routes.app.listProduct.details(details))
                  ? "text-primary"
                  : "text-gray-med"
                } mx-2 text-base font-normal `}
              to={routes.app.listProduct.details(details)}
            >
              {selectedContent[localizationKeys.productDetails]}
            </Link>
          ),
        },
      ],
    ].filter(Boolean);

  return (
    <Breadcrumb
      className="Edit_Breadcrumb"
      sections={ListProductSections(pathname, details)}
    />
  );
};
