import puppeteer from "puppeteer";
import dotenv from 'dotenv'
import { v4 as uuid } from "uuid";

import { hashtagsProgrammer as hashtags } from './hashtags.js'
import { shuffle, delay } from './utils.js'
import { login, like, comment, followAfterUnfollow } from '../services.js'

dotenv.config({})

async function run() {
  const browser = await puppeteer.launch({
    headless: false, defaultViewport: null, args: [
      '--window-size=1920,1080',
    ],
  });
  const page = await browser.newPage();
  await page.goto('https://www.instagram.com/accounts/login/');

  await page.waitForSelector("input[name=username]")

  await login(page)

  const hashtagsShuffle = shuffle(hashtags)
  for (const hashtag of hashtagsShuffle) {
    await page.goto(`https://www.instagram.com/explore/tags/${hashtag}/`)
    await page.waitForSelector("article img")
    const linksMostRecent = await page.evaluate(() => {
      const ancoras = document.querySelectorAll("article > div:nth-child(3) a")
      const imageLinks = [...ancoras]
      const links = imageLinks.map(link => (
        link.href
      ))
      return links

    })
    for (const link of linksMostRecent) {
      await page.goto(link, { waitUntil: 'networkidle0' })
      await page.screenshot({ path: `post-${uuid()}.png` });
      // await page.screenshot({ path: `post-${uuid()}.png`, fullPage: true });

      await like(page)
      // await comment(page, hashtag)
      // await delay(1500)
      await followAfterUnfollow(page)

    }
  }
  await browser.close();
}
run()