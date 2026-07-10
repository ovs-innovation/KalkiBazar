import React from "react";
import Scrollbars from "react-custom-scrollbars-2";

import LabelArea from "@/components/form/selectOption/LabelArea";
import Title from "@/components/form/others/Title";
import InputArea from "@/components/form/input/InputArea";
import DrawerButton from "@/components/form/button/DrawerButton";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import Error from "@/components/form/others/Error";
import useTestimonialSubmit from "@/hooks/useTestimonialSubmit";

const TestimonialDrawer = ({ id }) => {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    status,
    setStatus,
    isSubmitting,
  } = useTestimonialSubmit(id);

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <Title
          title={id ? "Update Testimonial" : "Add Testimonial"}
          description="Add customer testimonials with YouTube video link"
        />
      </div>

      <Scrollbars className="w-full relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 flex-grow scrollbar-hide w-full max-h-full pb-40 space-y-6">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6">
              <LabelArea label="Title" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  required
                  register={register}
                  name="title"
                  type="text"
                  placeholder="Enter testimonial title"
                />
                <Error errorName={errors.title} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6">
              <LabelArea label="YouTube Video URL" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  required
                  register={register}
                  name="video"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/... or https://www.youtube.com/shorts/..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a valid YouTube video URL
                </p>
                <Error errorName={errors.video} />
              </div>
            </div>

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
            title="Testimonial"
            isSubmitting={isSubmitting}
          />
        </form>
      </Scrollbars>
    </>
  );
};

export default TestimonialDrawer;

