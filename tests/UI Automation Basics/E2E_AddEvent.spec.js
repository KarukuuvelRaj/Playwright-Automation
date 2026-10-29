import {test,expect} from "@playwright/test"
const BASE_URL = "https://eventhub.rahulshettyacademy.com"
const userEmail = "john@gmail.com"
const pwd = "Raj@1993"
async function login(page) {
    await page.goto(`${BASE_URL}/login`)
    await page.getByPlaceholder("you@email.com").fill(userEmail)
    await page.getByLabel("Password").fill(pwd)
    await page.getByRole("button",{name:'Sign In'}).click()
    await expect(page.getByText("Browse Events →")).toBeVisible()
}
test("Create & Book Event", async({page})=>{
    //Step 1 — Login
    await login(page)
    //Step 2 — Create a new event
    await page.getByRole("button",{name:'Admin'}).click()
    await page.getByText("Manage Events").nth(0).click()
    const eventTitle = `Test Event ${Date.now()}`
    console.log(`Event title is: ${eventTitle}`)
    await page.getByLabel("Title").fill(eventTitle)
    await page.getByPlaceholder("Describe the event…").fill("Test Event")
    await page.getByLabel("Category").selectOption("Festival")
    await page.getByLabel("City").fill("Chennai")
    await page.getByLabel("Venue").fill("Railway Ground")
    await page.getByLabel("Event Date & Time").fill('2026-12-31T10:00')
    await page.getByLabel("Price ($)").fill("100")
    await page.getByLabel("Total Seats").fill("50")
    await page. getByRole("button",{name: '+ Add Event'}).click()
    await expect(page.getByText("Event created!")).toBeVisible()
    await page.locator("#nav-events").click()
    //Step 3 — Find the event card and capture seats
    const allCards=page.locator(".grid-cols-1").nth(0)
    await expect(allCards.locator("article").first()).toBeVisible()
    const matchingEvent = allCards.locator("article").filter({hasText: eventTitle})
    await expect(matchingEvent).toHaveCount(1)
    await expect(matchingEvent).toBeVisible({timeout:6000})
    //console.log(await matchingEvent.textContent())
    const noOfSeats=matchingEvent.locator("div span").nth(3)
    const seatsBeforeBooking=parseInt(await noOfSeats.innerText())
    console.log(`Total Seat Count: ${seatsBeforeBooking}`)
    //Step 4 — Start booking
    await matchingEvent.locator("div").getByTestId("book-now-btn").click()
    //Step 5 — Fill booking form
    await expect(page.locator("#ticket-count")).toHaveText("1")
    await page.locator("#customerName").fill("John Rogers")
    await page.getByLabel("Email").fill(`${userEmail}`)
    await page.getByLabel("Phone Number").fill("9876543210")
    await page.getByRole("button",{name: 'Confirm Booking'}).click()
    await expect(page.getByText("Booking Confirmed! 🎉")).toBeVisible()
    //Step 6 — Verify booking confirmation
    const confirmation = page.locator(".booking-ref")
    await expect(confirmation).toBeVisible()
    const bookingRef=await confirmation.textContent()
    //Step 7 — Verify in My Bookings
    await page.getByRole("button",{name: 'View My Bookings'}).click()
    await expect(page).toHaveURL(`${BASE_URL}/bookings`)
    const bookingCards = page.getByTestId("booking-card")
    await expect(bookingCards.first()).toBeVisible()
    const matchedCard=bookingCards.filter({hasText:bookingRef})
    await expect(matchedCard).toBeVisible()
    await expect(matchedCard.locator("h3")).toContainText(eventTitle)
    //Step 8 — Verify seat reduction
    await page.goto(`${BASE_URL}/events`)
    const updatedCard = page.getByRole("article").filter({hasText:eventTitle})
    await expect(updatedCard).toHaveCount(1)
    const seatsAfterBooking=parseInt(await updatedCard.getByText("seats").innerText())
    console.log(`Seats after booking: ${seatsAfterBooking}`)  
    expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1)
})