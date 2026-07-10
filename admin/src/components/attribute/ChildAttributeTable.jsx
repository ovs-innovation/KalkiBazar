import { TableBody, TableCell, TableRow } from "@windmill/react-ui";
import React from "react";

//internal import
import useToggleDrawer from "@/hooks/useToggleDrawer";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import MainDrawer from "@/components/drawer/MainDrawer";
import CheckBox from "@/components/form/others/CheckBox";
import DeleteModal from "@/components/modal/DeleteModal";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import ShowHideButton from "@/components/table/ShowHideButton";
import AttributeChildDrawer from "@/components/drawer/AttributeChildDrawer";

const ChildAttributeTable = ({
  att,
  loading,
  isCheck,
  setIsCheck,
  childAttributes,
  lang,
}) => {
  // console.log(lang);
  // console.log("att", childAttributes);

  const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
  const { showingTranslateValue } = useUtilsFunction();

  // Check if this is a color attribute
  const isColorAttribute = att?.title?.en?.toLowerCase() === "color" || 
                          att?.name?.en?.toLowerCase() === "color";

  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

  return (
    <>
      {isCheck.length < 1 && <DeleteModal id={serviceId} title={title} />}

      {isCheck.length < 2 && (
        <MainDrawer>
          <AttributeChildDrawer id={serviceId} />
        </MainDrawer>
      )}

      <TableBody>
        {childAttributes?.map((attribute, index) => (
          <TableRow key={index + 1}>
            <TableCell>
              <CheckBox
                type="checkbox"
                name="child-attribute"
                id={attribute._id}
                handleClick={handleClick}
                isChecked={isCheck?.includes(attribute._id)}
              />
            </TableCell>
            <TableCell className="font-semibold uppercase text-xs">
              {attribute?._id?.substring(20, 24)}
            </TableCell>

            <TableCell className="font-medium text-sm">
              <div className="flex items-center space-x-2">
                <span>{showingTranslateValue(attribute?.name)}</span>
                {/* Hex Color Display - Only show for Color attributes */}
                {isColorAttribute && attribute?.hexColor && (
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded border border-gray-300"
                      style={{ backgroundColor: attribute.hexColor }}
                    />
                    <span className="text-xs font-mono text-gray-600">
                      {attribute.hexColor}
                    </span>
                  </div>
                )}
              </div>
            </TableCell>

            <TableCell className="font-medium text-sm">{att?.option}</TableCell>

            <TableCell className="text-center">
              <ShowHideButton id={attribute._id} status={attribute.status} />
            </TableCell>

            <TableCell>
              <EditDeleteButton
                id={attribute._id}
                isCheck={isCheck}
                setIsCheck={setIsCheck}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                title={showingTranslateValue(attribute.name)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default ChildAttributeTable;
