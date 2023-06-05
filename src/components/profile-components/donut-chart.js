import React from "react";
import { VictoryPie } from "victory";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";

const DonutChart = ({
  isTotalAuctions,
  //
  active,
  drafted,
  sold,
  scheduled,
  expired,
  pending,
  //
  inProgressAuction,
  pendingAuction,
  completedAuction,
  expiredAuctions,
  waitingForDeliveryAuctions,
  //
  totalcount,
}) => {
  const [lang] = useLanguage();
  const selectedContent = content[lang];
  const totalAuctionsData = [
    { x: "Active Auctions", y: active },
    { x: "Drafts", y: drafted },
    { x: "Sold", y: sold },
    { x: "Scheduled", y: scheduled },
    { x: "Expired", y: expired },
    { x: "Pending", y: pending },
  ];

  const totalBidsData = [
    { x: "In Progress Auction", y: inProgressAuction },
    { x: "Pending Auction", y: pendingAuction },
    { x: "Completed Auction", y: completedAuction },
    { x: "Expired Auctions", y: expiredAuctions },
    { x: "Waiting For Delivery Auctions", y: waitingForDeliveryAuctions },
  ];

  const auctionscolorScale = [
    "#45BF55",
    "#67C6B9",
    "#A2547A",
    "#FBAE4C",
    "#ACACAC",
    "#00134F",
  ];
  const bidscolorScale = [
    "#45BF55",
    "#67C6B9",
    "#A2547A",
    "#ACACAC",
    "#FBAE4C",
  ];

  console.log({ isTotalAuctions });

  const options = {
    innerRadius: 40,
    style: {
      data: {
        strokeWidth: 90,
      },
    },
    labels: [], // Set the labels prop to an empty array to remove the labels
  };
  return (
    <div dir="ltr" className="w-32 h-40 px-1 py-6">
      <svg className="w-fit flex justify-center ">
        <text x={50} y={49} textAnchor="middle" fontSize={14} fill="#ACACAC">
          {totalcount}
        </text>
        <text x={50} y={64} textAnchor="middle" fontSize={14} fill="#ACACAC">
          {selectedContent[localizationKeys.total]}
        </text>
        <VictoryPie
          data={isTotalAuctions ? totalAuctionsData : totalBidsData}
          innerRadius={options.innerRadius}
          style={options.style}
          standalone={false}
          height={100}
          width={100}
          padding={{ top: 0, bottom: 0, left: 0, right: 0 }}
          colorScale={isTotalAuctions ? auctionscolorScale : bidscolorScale}
          labels={options.labels} // Pass the labels prop to the VictoryPie component
        />
      </svg>
    </div>
  );
};

export default DonutChart;
