import React from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Breadcrumb } from "semantic-ui-react";
import { useLanguage } from "../../../context/language-context";
import routes from "../../../routes";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";
import queryString from "query-string";
import { DEFAULT_PAGE, getDefaultPerPage } from "constants/pagination";
import { IoArrowBack } from "react-icons/io5";

export const CreateAuctionBreadcrumb = ({ edit }) => {
  const history = useHistory();
  const { pathname } = useLocation();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const CreateAuctionSections = (pathname) => {
    const isAuctionFlow = pathname.includes("create-auction");
    const isListingFlow = pathname.includes("list-product") || pathname.includes("add-location");

    return [
      {
        key: "Home",
        content: (
          <Link className="text-gray-med mx-2 text-base font-normal" to={routes.app.home}>
            {selectedContent[localizationKeys.home]}
          </Link>
        ),
      },
      // --- AUCTION FLOW SEGMENTS ---
      ...(isAuctionFlow ? [
        {
          key: "Create Auction",
          content: (
            <Link
              className={`${pathname.includes("product-details") ? "text-gray-med" : "text-primary dark:text-white"} mx-2 text-base font-normal`}
              to={routes.app.createAuction.default}
            >
              {selectedContent[localizationKeys.createAuction]}
            </Link>
          ),
        },
        pathname.includes("product-details") && {
          key: "Product Details",
          content: (
            <span
              className={`${pathname.includes("auction-details") ? "text-gray-med" : "text-primary dark:text-white"} mx-2 text-base font-normal`}
            >
              {selectedContent[localizationKeys.productDetails]}
            </span>
          ),
        },
        pathname.includes("auction-details") && {
          key: "Auction Details",
          content: (
            <span
              className={`${pathname.includes("shipping-details") ? "text-gray-med" : "text-primary dark:text-white"} mx-2 text-base font-normal`}
            >
              {selectedContent[localizationKeys.auctionDetails]}
            </span>
          ),
        },
        pathname.includes("shipping-details") && {
          key: "Shipping Details",
          content: (
            <span
              className={`${pathname.includes("payment-details") ? "text-gray-med" : "text-primary dark:text-white"} mx-2 text-base font-normal`}
            >
              {selectedContent[localizationKeys.shippingDetails]}
            </span>
          ),
        },
        pathname.includes("payment-details") && {
          key: "Payment Details",
          content: (
            <span className="text-primary dark:text-white mx-2 text-base font-normal">
              {selectedContent[localizationKeys.paymentDetails]}
            </span>
          ),
        },
      ] : []),

      // --- LISTING FLOW SEGMENTS ---
      ...(isListingFlow ? [
        {
          key: "List Item",
          content: (
            <Link
              className={`${pathname.includes("add-location") ? "text-gray-med" : "text-primary dark:text-white"} mx-2 text-base font-normal`}
              to={routes.app.listProduct.default}
            >
              {selectedContent[localizationKeys.listItem]}
            </Link>
          ),
        },
        pathname.includes("add-location") && {
          key: "Location Details",
          content: (
            <span className="text-primary dark:text-white mx-2 text-base font-normal">
              {selectedContent[localizationKeys.locationDetails]}
            </span>
          ),
        },
      ] : []),
    ].filter(Boolean);
  };

  const getPreviousStep = () => {
    if (pathname.includes("add-location")) return routes.app.listProduct.default;
    if (pathname.includes("shipping-details")) return routes.app.createAuction.auctionDetails;
    if (pathname.includes("payment-details")) return routes.app.createAuction.shippingDetails;
    return routes.app.home;
  };

  const previousStep = getPreviousStep();

  return (
    <div className="flex items-center gap-2 group mb-4 sm:mb-0">
      {pathname.includes("add-location") && (
        <button
          onClick={() => history.push(previousStep)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-[#1A2131] border border-gray-100 dark:border-white/10 text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-[#d4af37] hover:border-primary/30 dark:hover:border-[#d4af37]/30 hover:shadow-lg transition-all active:scale-95"
          title="Go Back"
        >
          <IoArrowBack className="w-5 h-5" />
        </button>
      )}

      <Breadcrumb
        className="Edit_Breadcrumb !m-0 !flex items-center"
        sections={CreateAuctionSections(pathname)}
      />
    </div>
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
              className={`${
                pathname.startsWith(routes.app.profile.default)
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
              className={`${
                pathname.startsWith(routes.app.profile.myAuctions.default)
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
              className={`${
                pathname.startsWith(routes.app.profile.myAuctions.active)
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
              className={`${
                pathname.startsWith(routes.app.profile.myAuctions.scheduled)
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
              className={`${
                pathname.startsWith(routes.app.profile.myAuctions.sold)
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
              className={`${
                pathname.startsWith(routes.app.profile.myAuctions.pending)
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
              className={`${
                pathname.startsWith(routes.app.profile.myAuctions.expired)
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
          routes.app.profile.myAuctions.activeDetails(details),
        ) && {
          key: "View Details",
          content: (
            <Link
              className={`${
                pathname.startsWith(
                  routes.app.profile.myAuctions.activeDetails(details),
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
          routes.app.profile.myAuctions.scheduledDetails(details),
        ) && {
          key: "View Details",
          content: (
            <Link
              className={`${
                pathname.startsWith(
                  routes.app.profile.myAuctions.scheduledDetails(details),
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
          routes.app.profile.myAuctions.soldDetails(details),
        ) && {
          key: "View Details",
          content: (
            <Link
              className={`${
                pathname.startsWith(
                  routes.app.profile.myAuctions.soldDetails(details),
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
          routes.app.profile.myAuctions.pendingDetails(details),
        ) && {
          key: "View Details",
          content: (
            <Link
              className={`${
                pathname.startsWith(
                  routes.app.profile.myAuctions.pendingDetails(details),
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
          routes.app.profile.myAuctions.expiredDetails(details),
        ) && {
          key: "View Details",
          content: (
            <Link
              className={`${
                pathname.startsWith(
                  routes.app.profile.myAuctions.expiredDetails(details),
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

export const AuctionHomeDetailsBreadcrumb = ({
  details,
  category,
  categoryId,
}) => {
  const { pathname } = useLocation();
  const [lang] = useLanguage("");
  const { search } = useLocation();
  const selectedContent = content[lang];
  const queryParams = new URLSearchParams(search);

  let page = Number(queryParams.get("auctionPage") || DEFAULT_PAGE);
  let perPage = Number(queryParams.get("perPage") || getDefaultPerPage());

  const parsed = queryString.parse(search, { arrayFormat: "bracket" });

  const filterParams = {
    page,
    perPage,
    categories: Array.isArray(parsed.categories)
      ? parsed.categories.map(Number)
      : [categoryId], // Ensure categoryId is included if no categories
    subCategory: Array.isArray(parsed.subCategory)
      ? parsed.subCategory.map(Number)
      : undefined,
    brands: Array.isArray(parsed.brands)
      ? parsed.brands.map(Number)
      : undefined,
    sellingType: parsed.sellingType,
    auctionStatus: parsed.auctionStatus,
    usageStatus: parsed.usageStatus ? [parsed.usageStatus] : undefined,
    priceFrom: parsed.priceFrom ? Number(parsed.priceFrom) : undefined,
    priceTo: parsed.priceTo ? Number(parsed.priceTo) : undefined,
  };

  // Remove undefined keys
  Object.keys(filterParams).forEach((key) => {
    if (filterParams[key] === undefined) {
      delete filterParams[key];
    }
  });

  const queryStr = queryString.stringify(filterParams, {
    arrayFormat: "bracket",
  });

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
            to={`${routes.app.categories(category, categoryId)}?${queryStr}`}
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
              className={`${
                pathname.startsWith(routes.app.homeDetails(details)) &&
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
              className={`${
                pathname.startsWith(routes.app.payDeposite(details))
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
              className={`${
                pathname.startsWith(routes.app.buyNow(details))
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

export const MyBidsBreadcrumb = ({ details, category, categoryId }) => {
  const { pathname } = useLocation();
  const [lang] = useLanguage("");
  const { search } = useLocation();
  const selectedContent = content[lang];
  const queryParams = new URLSearchParams(search);

  let page = Number(queryParams.get("auctionPage") || DEFAULT_PAGE);
  let perPage = Number(queryParams.get("perPage") || getDefaultPerPage());

  const parsed = queryString.parse(search, { arrayFormat: "bracket" });

  const filterParams = {
    page,
    perPage,
    categories: Array.isArray(parsed.categories)
      ? parsed.categories.map(Number)
      : [categoryId], // Ensure categoryId is included if no categories
    subCategory: Array.isArray(parsed.subCategory)
      ? parsed.subCategory.map(Number)
      : undefined,
    brands: Array.isArray(parsed.brands)
      ? parsed.brands.map(Number)
      : undefined,
    sellingType: parsed.sellingType,
    auctionStatus: parsed.auctionStatus,
    usageStatus: parsed.usageStatus ? [parsed.usageStatus] : undefined,
    priceFrom: parsed.priceFrom ? Number(parsed.priceFrom) : undefined,
    priceTo: parsed.priceTo ? Number(parsed.priceTo) : undefined,
  };

  // Remove undefined keys
  Object.keys(filterParams).forEach((key) => {
    if (filterParams[key] === undefined) {
      delete filterParams[key];
    }
  });

  const queryStr = queryString.stringify(filterParams, {
    arrayFormat: "bracket",
  });

  const MyBidsSections = (pathname, details, category) =>
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
            to={`${routes.app.categories(category, categoryId)}?${queryStr}`}
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
              className={`${
                pathname.startsWith(routes.app.profile.default)
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
              className={`${
                pathname.startsWith(routes.app.profile.myBids.default)
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
              className={`${
                pathname.startsWith(routes.app.profile.myBids.inPogress)
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
              className={`${
                pathname.startsWith(routes.app.profile.myBids.pending)
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
              className={`${
                pathname.startsWith(
                  routes.app.profile.myBids.waitingForDelivery,
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
              className={`${
                pathname.startsWith(routes.app.profile.myBids.expired)
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
              className={`${
                pathname.startsWith(routes.app.profile.myBids.completed)
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
              className={`${
                pathname.startsWith(routes.app.profile.myBids.completePayment)
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
          routes.app.profile.myBids.inPogressDetails(details),
        ) && {
          key: "View Details",
          content: (
            <Link
              className={`${
                pathname.startsWith(
                  routes.app.profile.myBids.inPogressDetails(details),
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
          routes.app.profile.myBids.pendingDetails(details),
        ) && {
          key: "View Details",
          content: (
            <Link
              className={`${
                pathname.startsWith(
                  routes.app.profile.myBids.pendingDetails(details),
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
          routes.app.profile.myBids.waitingForDeliveryDetails(details),
        ) && {
          key: "View Details",
          content: (
            <Link
              className={`${
                pathname.startsWith(
                  routes.app.profile.myBids.waitingForDeliveryDetails(details),
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
          routes.app.profile.myBids.expiredDetails(details),
        ) && {
          key: "View Details",
          content: (
            <Link
              className={`${
                pathname.startsWith(
                  routes.app.profile.myBids.expiredDetails(details),
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
          routes.app.profile.myBids.completedDetails(details),
        ) && {
          key: "View Details",
          content: (
            <Link
              className={`${
                pathname.startsWith(
                  routes.app.profile.myBids.completedDetails(details),
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
            className="text-primary dark:text-primary-veryLight mx-2 text-base font-normal"
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
              className={`${
                pathname.startsWith(routes.app.faqs)
                  ? "text-primary dark:text-primary-veryLight"
                  : "text-gray-med dark:text-gray-light"
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

export const ListProductsBreadcrumb = ({ details, category, categoryId }) => {
  const { pathname } = useLocation();
  const { search } = useLocation();
  const history = useHistory();
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const queryParams = new URLSearchParams(search);

  let page = Number(queryParams.get("auctionPage") || DEFAULT_PAGE);
  let perPage = Number(queryParams.get("perPage") || getDefaultPerPage());

  const parsed = queryString.parse(search, { arrayFormat: "bracket" });

  const filterParams = {
    page,
    perPage,
    categories: Array.isArray(parsed.categories)
      ? parsed.categories.map(Number)
      : [categoryId], // Ensure categoryId is included if no categories
    subCategory: Array.isArray(parsed.subCategory)
      ? parsed.subCategory.map(Number)
      : undefined,
    brands: Array.isArray(parsed.brands)
      ? parsed.brands.map(Number)
      : undefined,
    sellingType: parsed.sellingType,
    auctionStatus: parsed.auctionStatus,
    usageStatus: parsed.usageStatus ? [parsed.usageStatus] : undefined,
    priceFrom: parsed.priceFrom ? Number(parsed.priceFrom) : undefined,
    priceTo: parsed.priceTo ? Number(parsed.priceTo) : undefined,
    // ensure backend can parse this correctly!
  };

  // Remove undefined keys
  Object.keys(filterParams).forEach((key) => {
    if (filterParams[key] === undefined) {
      delete filterParams[key];
    }
  });

  const queryStr = queryString.stringify(filterParams, {
    arrayFormat: "bracket",
  });

  const ListProductSections = (pathname, details, category) =>
    [
      {
        key: "home",
        content: (
          <Link
            className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors mx-2 text-sm md:text-base font-medium"
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
            className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors mx-2 text-sm md:text-base font-medium"
            to={`${routes.app.categories(category, categoryId)}?${queryStr}`}
          >
            {category}
          </Link>
        ),
      },
      ...[
        pathname.startsWith(routes.app.listProduct.details(details)) && {
          key: "product-details",
          content: (
            <Link
              className={`${
                pathname.startsWith(routes.app.listProduct.details(details))
                  ? "text-primary dark:text-white font-bold"
                  : "text-gray-500 dark:text-gray-400 font-medium"
              } mx-2 text-sm md:text-base transition-colors hover:text-primary`}
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
      sections={ListProductSections(pathname, details, category)}
    />
  );
};
