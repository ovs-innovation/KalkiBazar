import requests from "./httpServices";

const NewsletterServices = {
  addNewsletter: async (body) => {
    return requests.post("/newsletter/add", body);
  },
};

export default NewsletterServices;
