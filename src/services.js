import { delay } from './utils.js'
async function login(page) {
  await page.focus("input[name=username]")
  await page.keyboard.type(process.env.INSTA_USERNAME)
  await page.focus("input[name=password]")
  await page.keyboard.type(process.env.INSTA_PASSWORD)

  await Promise.all([
    page.click('button[type=submit]'),
    page.waitForNavigation()
  ]);

}
async function like(page) {
  await page.click('article section:nth-child(1) span:nth-child(1) > button:nth-child(1)')
}
async function comment(page, message) {
  await page.focus("form textarea")
  await page.keyboard.type(message)
  await page.click('form button[type=submit]')
}
async function followAfterUnfollow(page) {
  await page.click('header button') //follow
  while (await page.$eval("header button div", el => el.textContent) != "Following") {
    delay(500)
  }
  await page.click('header button') //unfollow
  await page.waitForSelector("div[role=dialog] button")
  await page.click('div[role=dialog] button') //confirm unfollow
}

export { login, comment, followAfterUnfollow, like }