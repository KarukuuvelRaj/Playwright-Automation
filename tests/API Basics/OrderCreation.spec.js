import {test, expect, request} from "@playwright/test"
import { APIUtils } from "../Utils/APIUtils.js"
const creds = {userEmail:"k.velu93@gmail.com",userPassword:"Raj@1993"}
const orderPayload = {orders:[{country:"Cuba",productOrderedId:"6960eae1c941646b7a8b3ed3"}]}
let response
test.beforeAll(async()=>{
    const apiContext=await request.newContext()
    const apiUtils = new APIUtils(apiContext, creds)
    response=await apiUtils.placeOrder(orderPayload)
})
test("Order Placed",async({page})=>{
    await page.addInitScript(auth=>{
        window.localStorage.setItem('token',auth)
    },response.token)
    await page.goto("https://rahulshettyacademy.com/client/#/dashboard/myorders")
    await page.locator("tbody:visible").waitFor()
    const table = page.locator(".table tbody")
    const totalOrders= table.locator("tr")
        for(let i=0; i<await totalOrders.count(); i++){
            const ord = await totalOrders.nth(i).locator("th").textContent()
            if(response.orderID.includes(ord)){
            console.log("Matched")
            await totalOrders.nth(i).locator("button:has-text('View')").click()
            break
        }
    }
    const orderDetail= await page.locator(".col-text").textContent()
    expect(response.orderID.includes(orderDetail)).toBeTruthy()
})