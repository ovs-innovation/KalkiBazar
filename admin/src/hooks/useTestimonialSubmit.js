import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { SidebarContext } from "@/context/SidebarContext";
import TestimonialServices from "@/services/TestimonialServices";
import { notifyError, notifySuccess } from "@/utils/toast";

const useTestimonialSubmit = (id) => {
  const { isDrawerOpen, closeDrawer, setIsUpdate } =
    useContext(SidebarContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ title, video, sortOrder }) => {
    try {
      setIsSubmitting(true);

      const payload = {
        title: title?.trim(),
        video: video?.trim() || "",
        status: status ? "published" : "draft",
        sortOrder:
          sortOrder !== undefined && sortOrder !== null && `${sortOrder}`.length
            ? Number(sortOrder)
            : 0,
      };

      if (!payload.title) {
        notifyError("Title is required.");
        setIsSubmitting(false);
        return;
      }

      if (!payload.video) {
        notifyError("YouTube video URL is required.");
        setIsSubmitting(false);
        return;
      }

      // Validate YouTube URL (including Shorts)
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]+/;
      if (!youtubeRegex.test(payload.video)) {
        notifyError("Please enter a valid YouTube video URL.");
        setIsSubmitting(false);
        return;
      }

      if (id) {
        const res = await TestimonialServices.updateTestimonial(id, payload);
        notifySuccess(res?.message || "Testimonial updated successfully");
      } else {
        const res = await TestimonialServices.createTestimonial(payload);
        notifySuccess(res?.message || "Testimonial created successfully");
      }

      setIsSubmitting(false);
      setIsUpdate(true);
      closeDrawer();
      reset();
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      reset();
      setStatus(true);
      clearErrors("title");
      clearErrors("video");
      return;
    }

    if (id) {
      (async () => {
        try {
          const testimonial = await TestimonialServices.getTestimonialById(id);
          setValue("title", testimonial?.title || "");
          setValue("video", testimonial?.video || "");
          setValue("sortOrder", testimonial?.sortOrder ?? 0);
          setStatus(testimonial?.status !== "draft");
        } catch (err) {
          notifyError(err?.response?.data?.message || err?.message);
        }
      })();
    }
  }, [id, isDrawerOpen, reset, setValue, clearErrors]);

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    status,
    setStatus,
    isSubmitting,
    setValue,
  };
};

export default useTestimonialSubmit;

