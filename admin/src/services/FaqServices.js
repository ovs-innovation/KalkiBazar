import requests from "./httpService";

const FaqServices = {
  getAllFaqs: async () => {
    return requests.get("/faqs/admin/all");
  },

  getFaqById: async (id) => {
    return requests.get(`/faqs/${id}`);
  },

  createFaq: async (body) => {
    return requests.post("/faqs", body);
  },

  updateFaq: async (id, body) => {
    return requests.put(`/faqs/${id}`, body);
  },

  deleteFaq: async (id) => {
    return requests.delete(`/faqs/${id}`);
  },
};

export default FaqServices;


