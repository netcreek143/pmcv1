import axios from 'axios';

const SHIPROCKET_API_URL = 'https://apiv2.shiprocket.in/v1/external';

export const shiprocketService = {
  async getToken() {
    const response = await axios.post(`${SHIPROCKET_API_URL}/auth/login`, {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    });
    return response.data.token;
  },

  async createOrder(orderData: any) {
    const token = await this.getToken();
    const response = await axios.post(`${SHIPROCKET_API_URL}/orders/create/adhoc`, orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getTracking(shipmentId: string) {
    const token = await this.getToken();
    const response = await axios.get(`${SHIPROCKET_API_URL}/courier/track/shipment/${shipmentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
