import React from "react";
import Scrollbars from "react-custom-scrollbars-2";

import LabelArea from "@/components/form/selectOption/LabelArea";
import Title from "@/components/form/others/Title";
import InputArea from "@/components/form/input/InputArea";
import TextAreaCom from "@/components/form/input/TextAreaCom";
import DrawerButton from "@/components/form/button/DrawerButton";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import Error from "@/components/form/others/Error";
import useFaqSubmit from "@/hooks/useFaqSubmit";

const FaqDrawer = ({ id, type = "qa" }) => {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    status,
    setStatus,
    isSubmitting,
    entryType,
  } = useFaqSubmit(id, type);

  const isVideo = entryType === "video";

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <Title
          title={
            id
              ? isVideo
                ? "Update FAQ Video"
                : "Update FAQ Question"
              : isVideo
              ? "Add FAQ Video"
              : "Add FAQ Question"
          }
          description={
            isVideo
              ? "Attach helpful explainer or testimonial videos."
              : "Create common customer questions with answers."
          }
        />
      </div>

      <Scrollbars className="w-full relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 flex-grow scrollbar-hide w-full max-h-full pb-40 space-y-6">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6">
              <LabelArea label={isVideo ? "Video Title" : "Question"} />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  required
                  register={register}
                  name="question"
                  type="text"
                  placeholder={
                    isVideo ? "Enter video title" : "Enter customer question"
                  }
                />
                <Error errorName={errors.question} />
              </div>
            </div>

            {!isVideo && (
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6">
                <LabelArea label="Answer" />
                <div className="col-span-8 sm:col-span-4">
                  <TextAreaCom
                    required
                    register={register}
                    name="answer"
                    placeholder="Provide the answer for customers"
                  />
                  <Error errorName={errors.answer} />
                </div>
              </div>
            )}

            {isVideo && (
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6">
                <LabelArea label="Video URL" />
                <div className="col-span-8 sm:col-span-4">
                  <InputArea
                    required
                    register={register}
                    name="videoUrl"
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  <Error errorName={errors.videoUrl} />
                </div>
              </div>
            )}

            {isVideo && (
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6">
                <LabelArea label="Short Description (optional)" />
                <div className="col-span-8 sm:col-span-4">
                  <TextAreaCom
                    register={register}
                    name="answer"
                    placeholder="Add a supporting caption or CTA"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6">
              <LabelArea label="Sort Order" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  name="sortOrder"
                  type="number"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6">
              <LabelArea label="Published" />
              <div className="col-span-8 sm:col-span-4">
                <SwitchToggle handleProcess={setStatus} processOption={status} />
              </div>
            </div>
          </div>

          <DrawerButton
            id={id}
            title={isVideo ? "FAQ Video" : "FAQ"}
            isSubmitting={isSubmitting}
          />
        </form>
      </Scrollbars>
    </>
  );
};

export default FaqDrawer;


