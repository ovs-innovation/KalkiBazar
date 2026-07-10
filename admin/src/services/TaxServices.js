import requests from "./httpService";

const TaxServices = {
  getAll: async () => {
    return requests.get("/tax");
  },
  add: async (body) => {
    return requests.post("/tax/add", body);
  },
  delete: async (id) => {
    return requests.delete(`/tax/${id}`);
  },
};

export default TaxServices;


