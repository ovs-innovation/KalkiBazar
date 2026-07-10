import requests from "./httpServices";

const ShiprocketServices = {
  // STEP 3 — Create Order
  createOrder: async (body) => requests.post("/shiprocket/create-order", body),

  // STEP 4.1 — Check Courier Serviceability
  checkCourierServiceability: async (body) =>
    requests.post("/shiprocket/courier/serviceability", body),

  // STEP 4.2 — Assign Courier & Generate AWB
  assignCourierAndGenerateAWB: async (body) =>
    requests.post("/shiprocket/courier/assign-awb", body),

  // STEP 5 — Generate Shipping Label (PDF)
  generateShippingLabel: async ({ shipmentId, orderId }) =>
    requests.get(
      `/shiprocket/courier/generate-label?shipment_id=${shipmentId}${
        orderId ? `&orderId=${orderId}` : ""
      }`
    ),

  // STEP 6 — Request Pickup
  requestPickup: async (body) =>
    requests.post("/shiprocket/courier/request-pickup", body),

  // STEP 7 — Track Shipment
  trackShipment: async ({ awbCode, orderId }) =>
    requests.get(
      `/shiprocket/courier/track/${awbCode}${
        orderId ? `?orderId=${orderId}` : ""
      }`
    ),
};

export default ShiprocketServices;


