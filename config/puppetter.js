import puppeteer from "puppeteer";

export const setUp = async () => {
  const browser = await puppeteer.launch();
  global.__BROWSER__ = browser;
};

export const tearDown = async () => {
  await global.__BROWSER__.close();
};
