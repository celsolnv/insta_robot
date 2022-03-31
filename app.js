import puppeteer from "puppeteer";
import dotenv from 'dotenv'
import { hashtagsProgrammer as hashtags } from './hashtags.js'

dotenv.config({})

async function delay(time) {
  await new Promise((resolve, reject) => {
    setTimeout(resolve, time)
  })
}


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

async function run() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.instagram.com/accounts/login/');

  await page.waitForSelector("input[name=username]")

  await login(page)

  for (const hashtag of hashtags) {
    await page.goto(`https://www.instagram.com/explore/tags/${hashtag}/`)
    await page.waitForSelector("article img")
    const linksMostRecent = await page.evaluate(() => {
      const ancoras = document.querySelectorAll("article > div:nth-child(3) a")
      console.log(ancoras)

      const imageLinks = [...ancoras]

      const links = imageLinks.map(link => (
        link.href
      ))

      return links

    })
    for (const link of linksMostRecent) {
      await page.goto(link)
      await page.waitForSelector("svg[aria-label=Like]");
      await page.click('article section:nth-child(1) span:nth-child(1) > button:nth-child(1)') //like button
      await delay(2000)
    }


  }

  await browser.close();
}
run()