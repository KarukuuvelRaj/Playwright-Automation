export class APIUtils{
    constructor(apiContext, creds){
        this.apiContext = apiContext
        this.creds = creds
    }
    async getToken(){
        const apiLoginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
        {
            data:this.creds
        })
         const apiLoginResJson=await apiLoginResponse.json()
         const token=apiLoginResJson.token
         return token
    }
    async placeOrder(orderPayload){
        let response={}
        response.token=await this.getToken()
        const apiPlaceOrderResponse=await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
                {
                    data : orderPayload,
                    headers: {
                        'Authorization' : response.token,
                        'content-type' : 'application/json'
                    }
                })
            const apiOrderPlacedResJson=await apiPlaceOrderResponse.json()
            console.log(apiOrderPlacedResJson)
            const orderID=apiOrderPlacedResJson.orders[0]
            response.orderID=orderID
            return response
    }
}