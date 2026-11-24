import { test, expect, request } from "@playwright/test"
const BASE_URL = "https://api.eventhub.rahulshettyacademy.com"
const gmailPayLoad = { email: "john@gmail.com", password: "Raj@1993" }
const yahooPayLoad = { email: "john@yahoo.com", password: "Raj@1993" }
let token
test("Access Denied Validation", async () => {
    //Step 1 — Login as Yahoo user via API
    const apiContext = await request.newContext()
    const loginResponse = await apiContext.post(`${BASE_URL}/api/auth/login`, {
        data: yahooPayLoad
    })
    expect(loginResponse.ok()).toBeTruthy()
    const loginJson = await loginResponse.json()
    token = loginJson.token
    //console.log(token)

    //Step 2 — Fetch events via API to get a valid event ID
    const eventResponse = await apiContext.get(`${BASE_URL}/api/events`, {
        headers: {
            'Authorization': 'Bearer' + " " + token
        }
    })
    expect(eventResponse.ok()).toBeTruthy()
    const eventJsonResonse = await eventResponse.json()
    const eventID = eventJsonResonse.data[1].id
    console.log("Event ID: " + eventID)

    //Step 3 — Create a booking via API as Yahoo user
    const bookingResponse = await apiContext.post(`${BASE_URL}/api/bookings`, {
        headers: {
            'Authorization': 'Bearer' + " " + token
        },
        data: {
            "eventId": `${eventID}`,
            "customerName": "Yahoo User",
            "customerEmail": "john@yahoo.com",
            "customerPhone": "+91-9876543210",
            "quantity": 1
        }
    })
    expect(bookingResponse.ok()).toBeTruthy()
    const bookingJson = await bookingResponse.json()
    const yahooBookingID = bookingJson.data.id
    console.log("Booking ID: " + yahooBookingID)
})