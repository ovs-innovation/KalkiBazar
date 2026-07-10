import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { SidebarContext } from "@/context/SidebarContext";
import FaqServices from "@/services/FaqServices";
import { notifyError, notifySuccess } from "@/utils/toast";

const useFaqSubmit = (id, initialType = "qa") => {
  const { isDrawerOpen, closeDrawer, setIsUpdate } =
    useContext(SidebarContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(true);
  const [entryType, setEntryType] = useState(initialType);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({
    question,
    answer,
    videoUrl,
    chatLink,
    sortOrder,
  }) => {
    try {
      setIsSubmitting(true);

      const payload = {
        type: entryType,
        question: question?.trim(),
        answer: answer?.trim(),
        videoUrl: videoUrl?.trim() || "",
        chatLink: chatLink?.trim() || "",
        status: status ? "published" : "draft",
        sortOrder:
          sortOrder !== undefined && sortOrder !== null && `${sortOrder}`.length
            ? Number(sortOrder)
            : 0,
      };

      if (!payload.question) {
        notifyError("Question is required.");
        setIsSubmitting(false);
        return;
      }

      if (entryType === "qa" && !payload.answer) {
        notifyError("Answer is required for FAQs.");
        setIsSubmitting(false);
        return;
      }

      if (entryType === "video" && !payload.videoUrl) {
        notifyError("Video URL is required.");
        setIsSubmitting(false);
        return;
      }

      if (id) {
        const res = await FaqServices.updateFaq(id, payload);
        notifySuccess(res?.message || "FAQ updated successfully");
      } else {
        const res = await FaqServices.createFaq(payload);
        notifySuccess(res?.message || "FAQ created successfully");
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
      setEntryType(initialType || "qa");
      clearErrors("question");
      clearErrors("answer");
      return;
    }

    if (id) {
      (async () => {
        try {
          const faq = await FaqServices.getFaqById(id);
          setEntryType(faq?.type || "qa");
          setValue("question", faq?.question || "");
          setValue("answer", faq?.answer || "");
          setValue("videoUrl", faq?.videoUrl || "");
          setValue("chatLink", faq?.chatLink || "");
          setValue("sortOrder", faq?.sortOrder ?? 0);
          setStatus(faq?.status !== "draft");
        } catch (err) {
          notifyError(err?.response?.data?.message || err?.message);
        }
      })();
    }
  }, [id, isDrawerOpen, reset, setValue, clearErrors, initialType]);

  useEffect(() => {
    if (!id && isDrawerOpen) {
      setEntryType(initialType || "qa");
    }
  }, [initialType, id, isDrawerOpen]);

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    status,
    setStatus,
    isSubmitting,
    entryType,
    setEntryType,
  };
};

export default useFaqSubmit;


