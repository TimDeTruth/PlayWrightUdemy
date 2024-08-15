class APIUtils {
  constructor(apiContext, loginPayload) {
    //local apiContext class object. class instance variable, access to entire class level
    this.apiContext = apiContext;
    this.loginPayload = loginPayload;
  }

  //method
  async getToken() {
    const loginResponse = await this.apiContext.post(
      "https://rahulshettyacademy.com/api/ecom/auth/login",
      {
        data: this.loginPayload,
      }
    );
    const loginResponseJson = await loginResponse.json();
    const token = loginResponseJson.token;
    console.log("the token: " + token);
    return token;
  }

  async createOrder(orderPayLoad) {
    let response = {};
    response.token = await this.getToken();

    const orderResponse = await this.apiContext.post(
      "https://rahulshettyacademy.com/api/ecom/order/create-order",
      {
        data: orderPayLoad,
        headers: {
          Authorization: response.token,
          "Content-Type": "application/json",
        },
      }
    );
    const orderResponseJson = await orderResponse.json();
    console.log(orderResponseJson);
    const orderId = orderResponseJson.orders[0];
    response.orderId = orderId; //assigned a property to the response object

    return response; //return the response order object, holds the orderID and the token
  }
}
module.exports = { APIUtils };
