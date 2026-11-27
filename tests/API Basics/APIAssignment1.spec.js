import {test,expect,request} from "@playwright/test"
const BASE_URL = "https://eventhub.rahulshettyacademy.com"
const creds = { email: "john@gmail.com", password: "Raj@1993" }
const SIX_EVENTS_RESPONSE = {
  data: [
    { id: 1, title: 'Tech Summit 2025', category: 'Conference', eventDate: '2025-06-01T10:00:00.000Z', venue: 'HICC', city: 'Hyderabad', price: '999', totalSeats: 200, availableSeats: 150, imageUrl: null, isStatic: false },
    { id: 2, title: 'Rock Night Live',  category: 'Concert',    eventDate: '2025-06-05T18:00:00.000Z', venue: 'Palace Grounds', city: 'Bangalore', price: '1500', totalSeats: 500, availableSeats: 300, imageUrl: null, isStatic: false },
    { id: 3, title: 'IPL Finals',       category: 'Sports',     eventDate: '2025-06-10T19:30:00.000Z', venue: 'Chinnaswamy', city: 'Bangalore', price: '2000', totalSeats: 800, availableSeats: 50, imageUrl: null, isStatic: false },
    { id: 4, title: 'UX Design Workshop', category: 'Workshop', eventDate: '2025-06-15T09:00:00.000Z', venue: 'WeWork', city: 'Mumbai', price: '500', totalSeats: 50, availableSeats: 20, imageUrl: null, isStatic: false },
    { id: 5, title: 'Lollapalooza India', category: 'Festival', eventDate: '2025-06-20T12:00:00.000Z', venue: 'Mahalaxmi Racecourse', city: 'Mumbai', price: '3000', totalSeats: 5000, availableSeats: 2000, imageUrl: null, isStatic: false },
    { id: 6, title: 'AI & ML Expo',    category: 'Conference',  eventDate: '2025-06-25T10:00:00.000Z', venue: 'Bangalore International Exhibition Centre', city: 'Bangalore', price: '750', totalSeats: 300, availableSeats: 180, imageUrl: null, isStatic: false },
  ],
  pagination: { page: 1, totalPages: 1, total: 6, limit: 12 },
}
const FOUR_EVENTS_RESPONSE = {
  data: [
    { id: 1, title: 'Tech Summit 2025', category: 'Conference', eventDate: '2025-06-01T10:00:00.000Z', venue: 'HICC', city: 'Hyderabad', price: '999', totalSeats: 200, availableSeats: 150, imageUrl: null, isStatic: false },
    { id: 2, title: 'Rock Night Live',  category: 'Concert',    eventDate: '2025-06-05T18:00:00.000Z', venue: 'Palace Grounds', city: 'Bangalore', price: '1500', totalSeats: 500, availableSeats: 300, imageUrl: null, isStatic: false },
    { id: 3, title: 'IPL Finals',       category: 'Sports',     eventDate: '2025-06-10T19:30:00.000Z', venue: 'Chinnaswamy', city: 'Bangalore', price: '2000', totalSeats: 800, availableSeats: 50, imageUrl: null, isStatic: false },
    { id: 4, title: 'UX Design Workshop', category: 'Workshop', eventDate: '2025-06-15T09:00:00.000Z', venue: 'WeWork', city: 'Mumbai', price: '500', totalSeats: 50, availableSeats: 20, imageUrl: null, isStatic: false },
  ],
  pagination: { page: 1, totalPages: 1, total: 4, limit: 12 },
};
async function loginAndGoToEvents(page){
    await page.goto(BASE_URL)
    await page.locator("#email").fill(creds.email)
    await page.getByPlaceholder("••••••").fill(creds.password)
    await page.getByRole("button", {name: 'Sign In'}).click()
    await expect(page.locator("#event-card").last()).toBeVisible()
    await page.goto(`${BASE_URL}/events`)
}
test("Test 1 — Banner IS visible when 6 events are returned", async({page})=>{
    await page.route("**/api/events**",
        async route => {
            const response=await page.request.fetch(route.request())
            let body = JSON.stringify(SIX_EVENTS_RESPONSE)
            await route.fulfill({
                body,
                response
            })
        }
    )
    await loginAndGoToEvents(page)
    const allEventCards=page.locator(".grid-cols-1 article")
    await expect(allEventCards.first()).toBeVisible()
    await expect(allEventCards).toHaveCount(6)
    const banner=page.locator(".text-amber-800 span")
    await expect(banner).toBeVisible()
    await expect(banner).toContainText("9 bookings")
})

test("Test 2 — Banner is NOT visible when 4 events are returned", async({page})=>{
    await page.route("**/api/events**",
        async route=>{
            const response=await page.request.fetch(route.request())
            let body = JSON.stringify(FOUR_EVENTS_RESPONSE)
            await route.fulfill({
                body,
                response
            })
        }
    )
    await loginAndGoToEvents(page)
    const allEventCards=page.locator(".grid-cols-1 article")
    await expect(allEventCards.first()).toBeVisible()
    await expect(allEventCards).toHaveCount(4)
    await expect(page.locator(".text-amber-800 span")).not.toBeVisible()
})