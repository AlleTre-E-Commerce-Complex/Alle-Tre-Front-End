import React, { useEffect, useState } from "react";
import { Pagination } from "semantic-ui-react";
import useFilter from "../../../hooks/use-filter";
import { DEFAULT_PAGE, getDefaultPerPage } from "../../../constants/pagination";
import "../../../../src/assets/style/pagination-app.css";

const PaginationApp = ({ totalPages, myRef, myRef1 }) => {
  const [page, setPage] = useFilter("page", DEFAULT_PAGE);
  const [perPage, setPerPage] = useFilter("perPage", getDefaultPerPage());
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newPerPage = getDefaultPerPage();
      if (newPerPage !== perPage) {
        setPerPage(newPerPage);
        setWindowWidth(window.innerWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [perPage, setPerPage]);

  const handlePageChange = (e, { activePage }) => {
    const newPage = activePage.toString();
    if (newPage !== page) {
      setPage(newPage);
      
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
      firstItem={windowWidth < 768 ? null : undefined}
      lastItem={windowWidth < 768 ? null : undefined}
      secondary
      totalPages={totalPages || 1}
      onPageChange={handlePageChange}
      size={windowWidth < 768 ? "mini" : "small"}
    />
  );
};

export default PaginationApp;
