import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud, FiXCircle } from "react-icons/fi";

import { notifyError, notifySuccess } from "@/utils/toast";

const VideoUploader = ({
  imageUrl = [],
  setImageUrl,
  folder = "product/videos",
  maxSizeInMB = 20,
}) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const isVideoUrl = (url = "") => {
    if (!url) return false;
    const lowered = url.toLowerCase();
    return lowered.includes(".mp4") || lowered.includes(".mov") || lowered.includes(".webm");
  };

  const currentVideoUrl = useMemo(() => {
    if (!Array.isArray(imageUrl)) return "";
    return imageUrl.find((img) => isVideoUrl(img)) || "";
  }, [imageUrl]);

  const uploadUrl = useMemo(() => {
    if (import.meta.env.VITE_APP_CLOUDINARY_VIDEO_URL) {
      return import.meta.env.VITE_APP_CLOUDINARY_VIDEO_URL;
    }
    if (import.meta.env.VITE_APP_CLOUDINARY_URL) {
      return import.meta.env.VITE_APP_CLOUDINARY_URL.replace(
        "/image/upload",
        "/auto/upload"
      );
    }
    return "";
  }, []);

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: {
      "video/mp4": [".mp4"],
      "video/webm": [".webm"],
      "video/quicktime": [".mov"],
    },
    multiple: false,
    maxFiles: 1,
    maxSize: maxSizeInMB * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      if (!acceptedFiles?.length) return;
      const droppedFile = acceptedFiles[0];
      setFile(
        Object.assign(droppedFile, {
          preview: URL.createObjectURL(droppedFile),
        })
      );
    },
  });

  useEffect(() => {
    if (!fileRejections?.length) return;

    fileRejections.forEach(({ file, errors }) => {
      errors.forEach((err) => {
        if (err.code === "file-too-large") {
          notifyError(
            `${file.path} is too large. Max size ${maxSizeInMB}MB.`
          );
        } else {
          notifyError(err.message);
        }
      });
    });
  }, [fileRejections, maxSizeInMB]);

  useEffect(() => {
    if (!file) return;
    if (!uploadUrl) {
      notifyError("Missing Cloudinary configuration for videos.");
      return;
    }

    const uploadVideo = async () => {
      try {
        setLoading(true);
        setStatusMessage("Uploading...");

        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET
        );
        formData.append("cloud_name", import.meta.env.VITE_APP_CLOUD_NAME);
        formData.append("folder", folder);

        const response = await axios({
          url: uploadUrl,
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: formData,
        });

        notifySuccess("Video uploaded successfully!");
        setImageUrl((prev = []) => {
          const filtered = Array.isArray(prev)
            ? prev.filter((media) => !isVideoUrl(media))
            : [];
          return [...filtered, response.data.secure_url];
        });
      } catch (error) {
        console.error(error);
        notifyError(
          error?.response?.data?.message || "Unable to upload the video."
        );
      } finally {
        setLoading(false);
        setStatusMessage("");
      }
    };

    uploadVideo();
  }, [file, folder, setImageUrl, uploadUrl]);

  useEffect(() => {
    return () => {
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);

  const handleRemoveVideo = () => {
    if (currentVideoUrl) {
      setImageUrl((prev = []) =>
        Array.isArray(prev)
          ? prev.filter((media) => media !== currentVideoUrl)
          : []
      );
    }
    if (file?.preview) {
      URL.revokeObjectURL(file.preview);
    }
    setFile(null);
  };

  return (
    <div className="w-full text-center">
      <div
        className="border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 pt-5 pb-6"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <span className="mx-auto flex justify-center">
          <FiUploadCloud className="text-3xl text-store-500" />
        </span>
        <p className="text-sm mt-2">Drag & drop your short video here</p>
        <em className="text-xs text-gray-400">
          Only .mp4, .mov, .webm files up to {maxSizeInMB}MB
        </em>
      </div>

      <div className="text-store-500">{loading && statusMessage}</div>

      {currentVideoUrl ? (
        <div className="relative mt-4">
          <video
            className="w-1/2 rounded-md border border-gray-100 dark:border-gray-600"
            src={currentVideoUrl}
            controls
          />
          <button
            type="button"
            className="absolute top-2 right-2 text-red-500 focus:outline-none bg-white rounded-full p-1 shadow"
            onClick={handleRemoveVideo}
          >
            <FiXCircle />
          </button>
        </div>
      ) : (
        file && (
          <video
            className="w-full rounded-md border border-gray-100 dark:border-gray-600 mt-4"
            src={file.preview}
            controls
          />
        )
      )}
    </div>
  );
};

export default VideoUploader;

