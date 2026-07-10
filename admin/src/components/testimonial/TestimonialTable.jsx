import React, { useState } from "react";
import { TableBody, TableCell, TableRow } from "@windmill/react-ui";
import { FiEdit, FiTrash2, FiChevronDown } from "react-icons/fi";

import Tooltip from "@/components/tooltip/Tooltip";

const TestimonialTable = ({ testimonials = [], handleEdit, handleDelete }) => {
  const [openIds, setOpenIds] = useState([]);

  const toggleRow = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isVideoUrl = (url = "") => {
    if (!url) return false;
    const lowered = url.toLowerCase();
    return lowered.includes(".mp4") || lowered.includes(".mov") || lowered.includes(".webm");
  };

  return (
    <TableBody className="dark:bg-gray-900">
      {testimonials.map((testimonial) => {
        const isOpen = openIds.includes(testimonial._id);
        return (
          <TableRow key={testimonial._id} className="border-b border-gray-200">
            <TableCell colSpan={4} className="p-0">
              <button
                type="button"
                onClick={() => toggleRow(testimonial._id)}
                className="w-full flex items-center justify-between px-4 py-3 text-left focus:outline-none"
              >
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {testimonial.title}
                </span>
                <FiChevronDown
                  className={`text-gray-600 transform transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {isVideoUrl(testimonial.video) ? (
                      <div className="mt-2">
                        <video
                          className="w-full max-w-md rounded-md border border-gray-200 dark:border-gray-600"
                          src={testimonial.video}
                          controls
                        />
                      </div>
                    ) : (
                      <div className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                        <a
                          href={testimonial.video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {testimonial.video}
                        </a>
                      </div>
                    )}
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Status: {testimonial.status || "published"} | Sort Order: {testimonial.sortOrder || 0}
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(testimonial);
                      }}
                      className="p-2 text-gray-400 hover:text-store-600 focus:outline-none"
                    >
                      <Tooltip
                        id={`edit-${testimonial._id}`}
                        Icon={FiEdit}
                        title="Edit"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(testimonial);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 focus:outline-none"
                    >
                      <Tooltip
                        id={`delete-${testimonial._id}`}
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

export default TestimonialTable;

