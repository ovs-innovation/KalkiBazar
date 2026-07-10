import React, { useState } from "react";
import { TableBody, TableCell, TableRow } from "@windmill/react-ui";
import { FiEdit, FiTrash2, FiChevronDown } from "react-icons/fi";

import Tooltip from "@/components/tooltip/Tooltip";

const FaqTable = ({ faqs = [], handleEdit, handleDelete, variant = "qa" }) => {
  const isVideo = variant === "video";
  const [openIds, setOpenIds] = useState([]);

  const toggleRow = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <TableBody className="dark:bg-gray-900">
      {faqs.map((faq) => {
        const isOpen = openIds.includes(faq._id);
        return (
          <TableRow key={faq._id} className="border-b border-gray-200">
            <TableCell colSpan={3} className="p-0">
              <button
                type="button"
                onClick={() => toggleRow(faq._id)}
                className="w-full flex items-center justify-between px-4 py-3 text-left focus:outline-none"
              >
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {faq.question}
                </span>
                <FiChevronDown
                  className={`text-gray-600 transform transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 flex items-start justify-between gap-4">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {isVideo ? (
                      <>
                        {faq.videoUrl && (
                          <a
                            href={faq.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline block mb-1"
                          >
                            {faq.videoUrl}
                          </a>
                        )}
                        <p>{faq.answer || "—"}</p>
                      </>
                    ) : (
                      <p>{faq.answer}</p>
                    )}
                  </div>

                  <div className="flex-shrink-0 flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(faq);
                      }}
                      className="p-2 text-gray-400 hover:text-store-600 focus:outline-none"
                    >
                      <Tooltip
                        id={`edit-${faq._id}`}
                        Icon={FiEdit}
                        title="Edit"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(faq);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 focus:outline-none"
                    >
                      <Tooltip
                        id={`delete-${faq._id}`}
                        Icon={FiTrash2}
                        title="Delete"
                        bgColor="#EF4444"
                      />
                    </button>
                  </div>
                </div>
              )}
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
};

export default FaqTable;


