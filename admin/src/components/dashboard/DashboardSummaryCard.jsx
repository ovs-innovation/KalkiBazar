import React from "react";
import { Card, CardBody } from "@windmill/react-ui";
import Skeleton from "react-loading-skeleton";

const DashboardSummaryCard = ({ title, Icon, quantity, loading, mode }) => {
  return (
    <>
      {loading ? (
        <Skeleton
          count={1}
          height={120}
          className="dark:bg-gray-800 bg-gray-200 rounded-xl"
          baseColor={`${mode === "dark" ? "#010101" : "#f9f9f9"}`}
          highlightColor={`${mode === "dark" ? "#1a1c23" : "#f8f8f8"} `}
        />
      ) : (
        <Card className="flex h-full bg-store-100 dark:bg-gray-800 border-none shadow-none rounded-xl">
          <CardBody className="flex items-center justify-between w-full p-6">
            <div className="flex items-center justify-center p-4 rounded-full bg-store-600 text-white shadow-lg">
              <Icon className="w-8 h-8" />
            </div>

            <div className="text-right">
              <h6 className="text-lg mb-1 font-bold text-gray-500 dark:text-gray-400">
                {title}
              </h6>
              <p className="text-4xl font-bold text-gray-800 dark:text-gray-200">
                {quantity}
              </p>
            </div>
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default DashboardSummaryCard;
