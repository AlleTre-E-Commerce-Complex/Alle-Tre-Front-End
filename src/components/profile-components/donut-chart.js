import React from "react";
import { VictoryPie } from "victory";

const DonutChart = ({}) => {
  const data = [
    { x: "Active Auctions", y: 1 },
    { x: "Drafts", y: 2 },
    { x: "Sold", y: 3 },
    { x: "Scheduled", y: 4 },
    { x: "Expired", y: 5 },
    { x: "Pending", y: 6 },
  ];

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
    <div className=" w-32 h-40 px-1 py-6">
      <svg className="w-fit flex justify-center">
        <text x={50} y={49} textAnchor="middle" fontSize={14} fill="#ACACAC">
          233.3
        </text>
        <text x={50} y={64} textAnchor="middle" fontSize={14} fill="#ACACAC">
          Total
        </text>
        <VictoryPie
          data={data}
          innerRadius={options.innerRadius}
          style={options.style}
          standalone={false}
          height={100}
          width={100}
          padding={{ top: 0, bottom: 0, left: 0, right: 0 }}
          colorScale={[
            "#45BF55",
            "#67C6B9",
            "#A2547A",
            "#FBAE4C",
            "#ACACAC",
            "#00134F",
          ]}
          labels={options.labels} // Pass the labels prop to the VictoryPie component
        />
      </svg>
    </div>
  );
};

export default DonutChart;
