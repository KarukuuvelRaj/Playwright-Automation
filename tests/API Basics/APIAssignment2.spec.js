import { test, expect, request } from "@playwright/test"
const API_URL = "https://api.eventhub.rahulshettyacademy.com"
const gmailPayLoad = { email: "john@gmail.com", password: "Raj@1993" }
const yahooPayLoad = { email: "john@yahoo.com", password: "Raj@1993" }
let token
async function login(page, guser){
    await page.goto("https://eventhub.rahulshettyacademy.com/login")
    await page.getByPlaceholder("you@email.com").fill(guser.email)
    await page.getByPlaceholder("••••••").fill(guser.password)
    await page.getByRole("button", {name: 'Sign In'}).click()
    await expect(page.locator("#event-card").last()).toBeVisible()
}
test("Access Denied Validation", async ({page}) => {
    //Step 1 — Login as Yahoo user via API
    const apiContext = await request.newContext()
    const loginResponse = await apiContext.post(`${API_URL}/api/auth/login`, {
        data: yahooPayLoad
    })
    expect(loginResponse.ok()).toBeTruthy()
    const loginJson = await loginResponse.json()
    token = loginJson.token
    //Step 2 — Fetch events via API to get a valid event ID
    const eventResponse = await apiContext.get(`${API_URL}/api/events`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    expect(eventResponse.ok()).toBeTruthy()
    const eventJsonResonse = await eventResponse.json()
    const eventID = eventJsonResonse.data[1].id
    console.log("Event ID: " + eventID)
    //Step 3 — Create a booking via API as Yahoo user
    const bookingResponse = await apiContext.post(`${API_URL}/api/bookings`, {
        headers: {
            'Authorization': `Bearer ${token}`
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
    //Step 4 — Login as Gmail user via browser UI
    await login(page,gmailPayLoad)
    //Step 5 — Navigate to Yahoo's booking URL as Gmail user
    await page.goto(`https://eventhub.rahulshettyacademy.com/bookings/${yahooBookingID}`, {waitUntil: 'networkidle'})
    //Step 6 — Validate Access Denied
    await expect(page.getByText("Access Denied")).toBeVisible()
    await expect(page.getByText("You are not authorized to view this booking.")).toBeVisible()
})