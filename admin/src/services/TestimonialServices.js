import requests from "./httpService";

const TestimonialServices = {
  getAllTestimonials: async () => {
    return requests.get("/testimonials/admin/all");
  },

  getTestimonialById: async (id) => {
    return requests.get(`/testimonials/${id}`);
  },

  createTestimonial: async (body) => {
    return requests.post("/testimonials", body);
  },

  updateTestimonial: async (id, body) => {
    return requests.put(`/testimonials/${id}`, body);
  },

  deleteTestimonial: async (id) => {
    return requests.delete(`/testimonials/${id}`);
  },
};

export default TestimonialServices;

