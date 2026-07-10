import requests from "./httpServices";

const FaqServices = {
  getPublicFaqs: async () => {
    return requests.get("/faqs");
  },
};

export default FaqServices;


