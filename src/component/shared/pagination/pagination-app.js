import React, { useEffect, useState } from "react";
import { Pagination } from "semantic-ui-react";
import useFilter from "../../../hooks/use-filter";
import { DEFAULT_PAGE, getDefaultPerPage } from "../../../constants/pagination";
import "../../../../src/assets/style/pagination-app.css";

const PaginationApp = ({
  totalPages,
  myRef,
  myRef1,
  type,
  setAuctionPageNumber,
  setListedPageNumber,
  setUpcomingAuctionPageNumber,
  perPage,
}) => {
  const pageParam =
    type === "auction"
      ? "auctionPage"
      : type === "products"
      ? "productPage"
      : type === "upcomingAuction"
      ? "UpcomingauctionPage"
      : "page";
  const [page, setPage] = useFilter(pageParam, DEFAULT_PAGE);
  const per_Page = perPage ? perPage : getDefaultPerPage();
  const [perpage, setPerPage] = useFilter("perPage", per_Page);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      const newPerPage = getDefaultPerPage();
      if (newPerPage !== perpage) {
        setPerPage(newPerPage);
        setWindowWidth(window.innerWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [perpage, setPerPage]);

  const handlePageChange = (e, { activePage }) => {
    const currentPage = parseInt(page);
    const targetPage = parseInt(activePage);
    const maxPages = parseInt(totalPages) || 1;

    // Ensure we don't exceed boundaries
    let newPage = Math.min(Math.max(1, targetPage), maxPages);

    // Convert to string for consistency with URL parameters
    const newPageStr = newPage.toString();

    if (newPageStr !== page) {
      setPage(newPageStr);

      if (type === "auction") {
        setAuctionPageNumber(newPageStr);
      } else if (type === "products") {
        setListedPageNumber(newPageStr);
      } else if (type === "upcomingAuction") {
        setUpcomingAuctionPageNumber(newPageStr);
      }

      // Smooth scroll to ref
      if (myRef?.current) {
        window.scrollTo({
          behavior: "smooth",
          top: myRef.current.offsetTop,
        });
      }
      if (myRef1?.current) {
        window.scrollTo({
          behavior: "smooth",
          top: myRef1.current.offsetTop,
        });
      }
    }
  };

  return (
    <Pagination
      className="Edit_Pagination_App"
      defaultActivePage={parseInt(page)}
      activePage={parseInt(page)}
      ellipsisItem={windowWidth < 768 ? null : undefined}
      firstItem={null}
      lastItem={null}
      prevItem={{ "aria-label": "Previous page" }}
      nextItem={{ "aria-label": "Next page" }}
      secondary
      totalPages={parseInt(totalPages) || 1}
      onPageChange={handlePageChange}
      size={windowWidth < 768 ? "mini" : "small"}
      boundaryRange={windowWidth < 768 ? 1 : 1}
      siblingRange={windowWidth < 768 ? 1 : 1}
    />
  );
};

export default PaginationApp;
