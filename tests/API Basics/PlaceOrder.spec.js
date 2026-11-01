import {test, expect, request} from "@playwright/test"
const creds = {userEmail:"k.velu93@gmail.com",userPassword:"Raj@1993"}
const orderPayload = {orders:[{country:"Cuba",productOrderedId:"6960eae1c941646b7a8b3ed3"}]}
let token
let orderID
test.beforeAll(async()=>{
    const apiContext=await request.newContext()
    const apiLoginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
        {
            data:creds
        })
        expect (apiLoginResponse.ok()).toBeTruthy()
         const apiLoginResJson=await apiLoginResponse.json()
         token=apiLoginResJson.token
         console.log(token)
    const apiPlaceOrderResponse=await apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
        {
            data : orderPayload,
            headers: {
                'Authorization' : token,
                'content-type' : 'application/json'
            }
        })
    expect(apiPlaceOrderResponse.status()).toBe(201)
    const apiOrderPlacedResJson=await apiPlaceOrderResponse.json()
    console.log(apiOrderPlacedResJson)
    orderID=apiOrderPlacedResJson.orders[0]
})
test("Order Placed",async({page})=>{
    await page.addInitScript(auth=>{
        window.localStorage.setItem('token',auth)
    },token)
    await page.goto("https://rahulshettyacademy.com/client/#/dashboard/myorders")
    await page.locator("tbody:visible").waitFor()
    const table = page.locator(".table tbody")
    const totalOrders= table.locator("tr")
        for(let i=0; i<await totalOrders.count(); i++){
            const ord = await totalOrders.nth(i).locator("th").textContent()
            if(orderID.includes(ord)){
            console.log("Matched")
            await totalOrders.nth(i).locator("button:has-text('View')").click()
            break
        }
    }
    const orderDetail= await page.locator(".col-text").textContent()
    expect(orderID.includes(orderDetail)).toBeTruthy()
})