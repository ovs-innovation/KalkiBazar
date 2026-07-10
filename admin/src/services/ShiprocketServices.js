import requests from "./httpService";

const ShiprocketServices = {
  createOrder: (body) => requests.post("/shiprocket/create-order", body),
  checkCourierServiceability: (body) =>
    requests.post("/shiprocket/courier/serviceability", body),
  assignCourierAndGenerateAWB: (body) =>
    requests.post("/shiprocket/courier/assign-awb", body),
  generateShippingLabel: ({ shipmentId, orderId }) =>
    requests.get(
      `/shiprocket/courier/generate-label?shipment_id=${shipmentId}${
        orderId ? `&orderId=${orderId}` : ""
      }`
    ),
  requestPickup: (body) =>
    requests.post("/shiprocket/courier/request-pickup", body),
  trackShipment: ({ awbCode, orderId }) =>
    requests.get(
      `/shiprocket/courier/track/${awbCode}${
        orderId ? `?orderId=${orderId}` : ""
      }`
    ),
  cancelShipment: (body) => requests.post("/shiprocket/courier/cancel", body),
  linkShipmentToOrder: (body) =>
    requests.post("/shiprocket/courier/link-shipment", body),
  downloadInvoice: ({ srOrderId, orderId }) =>
    requests.get(
      `/shiprocket/order/invoice?order_id=${srOrderId}${
        orderId ? `&orderId=${orderId}` : ""
      }`
    ),
};

export default ShiprocketServices;


