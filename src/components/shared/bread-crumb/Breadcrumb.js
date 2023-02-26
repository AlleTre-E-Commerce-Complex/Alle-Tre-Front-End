import React from "react";
import { Link, useLocation, u } from "react-router-dom";
import { Breadcrumb } from "semantic-ui-react";
import { useLanguage } from "../../../context/language-context";
import { content } from "../../../localization/content";
import routes from "../../../routes";

export const ContainersBreadcrumb = ({ edit }) => {
  const { pathname } = useLocation();
  const [lang, setLang] = useLanguage("");
  const langContent = content[lang];

  const containersSections = (pathname, edit) =>
    [
      {
        key: "Dashboard",
        content: (
          <Link
            className="text-textGray1 text-sm font-normal"
            to={routes.Dashboard.containers.base}
          >
            {langContent.containers.dashboard}
          </Link>
        ),
      },
      ...[
        pathname.startsWith(routes.Dashboard.containers.base) && {
          key: "My Containers",
          content: (
            <Link
              className="text-textGray1 text-sm font-normal"
              to={routes.Dashboard.containers.base}
            >
              {langContent.containers.myContainer}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.Dashboard.containers.add) && {
          key: "Add new container",
          content: (
            <Link
              className="text-textGray1 text-sm font-normal"
              to={routes.Dashboard.containers.add}
            >
              {langContent.containers.addContainer}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.Dashboard.containers.edit(edit)) && {
          key: "Edit Container",
          content: (
            <Link
              className="text-textGray1 text-sm font-normal"
              to={routes.Dashboard.containers.edit(edit)}
            >
              {langContent.containers.editContainer}
            </Link>
          ),
        },
      ],
    ].filter(Boolean);

  return (
    <Breadcrumb
      icon="right angle"
      sections={containersSections(pathname, edit)}
    />
  );
};

export const OrdersBreadcrumb = ({ view }) => {
  const { pathname } = useLocation();
  const [lang, setLang] = useLanguage("");
  const langContent = content[lang];
  const ordersSections = (pathname) =>
    [
      {
        key: "Dashboard",
        content: (
          <Link
            className="text-textGray1 text-sm font-normal"
            to={routes.Dashboard.containers.base}
          >
            {langContent.containers.dashboard}
          </Link>
        ),
      },
      ...[
        pathname.startsWith(routes.Dashboard.orders.base) && {
          key: "Orders",
          content: (
            <Link
              className="text-textGray1 text-sm font-normal"
              to={routes.Dashboard.orders.today}
            >
              {langContent.orders.orders}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.Dashboard.orders.searchOrders) && {
          key: "search orders",
          content: (
            <Link
              className="text-textGray1 text-sm font-normal"
              to={routes.Dashboard.orders.searchOrders}
            >
              {langContent.orders.searchOrders}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.Dashboard.orders.today) && {
          key: "Today's orders",
          content: (
            <Link
              className="text-textGray1 text-sm font-normal"
              to={routes.Dashboard.orders.today}
            >
              {langContent.orders.today}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.Dashboard.orders.pending) && {
          key: " Pending orders",
          content: (
            <Link
              className="text-textGray1 text-sm font-normal"
              to={routes.Dashboard.orders.pending}
            >
              {langContent.orders.pending}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.Dashboard.orders.active) && {
          key: "Active orders",
          content: (
            <Link
              className="text-textGray1 text-sm font-normal"
              to={routes.Dashboard.orders.active}
            >
              {langContent.orders.active}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.Dashboard.orders.history) && {
          key: "History",
          content: (
            <Link
              className="text-textGray1 text-sm font-normal"
              to={routes.Dashboard.orders.history}
            >
              {langContent.orders.history}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.Dashboard.orders.pickup) && {
          key: " Pickup requests",
          content: (
            <Link
              className="text-textGray1 text-sm font-normal"
              to={routes.Dashboard.orders.pickup}
            >
              {langContent.orders.pickup}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.Dashboard.orders.viewSearchOrders(view)) && {
          key: "View Order",
          content: (
            <Link
              className="text-textGray1 text-sm font-normal"
              to={routes.Dashboard.orders.viewSearchOrders(view)}
            >
              {langContent.orders.viewOrder}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.Dashboard.orders.viewTodayOrders(view)) && {
          key: "View Order",
          content: (
            <Link
              className="text-textGray1 text-sm font-normal"
              to={routes.Dashboard.orders.viewTodayOrders(view)}
            >
              {langContent.orders.viewOrder}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.Dashboard.orders.viewActiveOrders(view)) && {
          key: "View Order",
          content: (
            <Link
              className="text-textGray1 text-sm font-normal"
              to={routes.Dashboard.orders.viewActiveOrders(view)}
            >
              {langContent.orders.viewOrder}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(
          routes.Dashboard.orders.viewPendingOrders(view)
        ) && {
          key: "View Order",
          content: (
            <Link
              className="text-textGray1 text-sm font-normal"
              to={routes.Dashboard.orders.viewPendingOrders(view)}
            >
              {langContent.orders.viewOrder}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(
          routes.Dashboard.orders.viewHistoryOrders(view)
        ) && {
          key: "View Order",
          content: (
            <Link
              className="text-textGray1 text-sm font-normal"
              to={routes.Dashboard.orders.viewHistoryOrders(view)}
            >
              {langContent.orders.viewOrder}
            </Link>
          ),
        },
      ],
      ...[
        pathname.startsWith(routes.Dashboard.orders.viewPickupOrders(view)) && {
          key: "View Order",
          content: (
            <Link
              className="text-textGray1 text-sm font-normal"
              to={routes.Dashboard.orders.viewPickupOrders(view)}
            >
              {langContent.orders.viewOrder}
            </Link>
          ),
        },
      ],
    ].filter(Boolean);

  return (
    <Breadcrumb icon="right angle" sections={ordersSections(pathname, view)} />
  );
};
