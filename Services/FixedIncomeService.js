import puppeteer from "puppeteer";
import delay from "../utils/delay.js";
import {
  URL,
  INPUT_TREASURE_TYPE,
  INPUT_INVESTMENT_DATE,
  INPUT_INVESTED_VALUE,
  INPUT_EARNING_RATE,
  INPUT_BANK_ADMIN_RATE,
  INPUT_SELIC_RATE,
  BUTTON_CALCULATE,
  DATA_ROW_CLASS,
  LABEL_DAYS_BETWEEN_INVESTMENT_WITHDRAW,
  LABEL_TAX_ALIQUOT,
  LABEL_TAX,
  LABEL_NET_VALUE,
  LABEL_NET_VALUE_AFTER_TAXES,
  INPUT_IPCA_RATE,
  BUTTON_ADVANCED_SIMULATION_CLASS,
  INPUT_EARNING_RATE_WITHDRAW,
  INPUT_WITHDRAW_DATE,
  LABEL_NET_VALUE_CUPOM,
} from "../utils/constants/basicSimulation.js";
import { BRL_CURRENCY } from "../utils/constants/currencies.js";
import { SELIC, IPCA } from "../utils/constants/treasuryCodes.js";

const getValueFromList = (list, label) => {
  const index = list.findIndex((v) => v === label);
  return index >= 0 && list[list.findIndex((v) => v === label) + 1];
};

const parseCurrency = (c) =>
  parseFloat(
    c.replace(BRL_CURRENCY, "").split(".").join("").split(",").join(".")
  );

export const getFixedIncomeDataFromURL = async ({
  code,
  value,
  earningRate,
  ipcaSelic,
  withdrawDate,
  earningRateWithdraw,
}) => {
  if (!code) throw { message: "Treasure code is required", statusCode: 400 };
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(URL);
  await page.select(INPUT_TREASURE_TYPE, code);
  await page.$eval(
    INPUT_INVESTMENT_DATE,
    (el) => (el.value = Intl.DateTimeFormat("pt-BR").format(new Date()))
  );
  await page.$eval(
    INPUT_INVESTED_VALUE,
    (el, value) => (el.value = value),
    value
  );
  await page.$eval(
    INPUT_EARNING_RATE,
    (el, value) => (el.value = value),
    earningRate
  );
  await page.$eval(INPUT_BANK_ADMIN_RATE, (el) => (el.value = "0"));
  if (SELIC.includes(code))
    await page.$eval(
      INPUT_SELIC_RATE,
      (el, value) => (el.value = value),
      ipcaSelic
    );
  if (IPCA.includes(code))
    await page.$eval(
      INPUT_IPCA_RATE,
      (el, value) => (el.value = value),
      ipcaSelic
    );
  await page.$eval(BUTTON_ADVANCED_SIMULATION_CLASS, (span) => span.click());
  await page.$eval(
    INPUT_WITHDRAW_DATE,
    (el, value) => (el.value = value),
    withdrawDate
  );
  await page.$eval(
    INPUT_EARNING_RATE_WITHDRAW,
    (el, value) => (el.value = value),
    earningRateWithdraw
  );

  await page.$eval(BUTTON_CALCULATE, (btn) => btn.click());
  await delay(1000);
  const values = await page.evaluate((DATA_ROW_CLASS) => {
    const tds = Array.from(document.querySelectorAll(DATA_ROW_CLASS));
    return tds.map((td) => td.textContent);
  }, DATA_ROW_CLASS);

  const daysBetweenInvestmentWithdraw = getValueFromList(
    values,
    LABEL_DAYS_BETWEEN_INVESTMENT_WITHDRAW
  );
  const taxAliquot = getValueFromList(values, LABEL_TAX_ALIQUOT);
  const tax = getValueFromList(values, LABEL_TAX);
  const netValue = parseCurrency(
    getValueFromList(values, LABEL_NET_VALUE) ||
      getValueFromList(values, LABEL_NET_VALUE_CUPOM)
  );
  const netValueAfterTaxes = getValueFromList(
    values,
    LABEL_NET_VALUE_AFTER_TAXES
  );
  browser.close();

  return {
    code,
    daysBetweenInvestmentWithdraw,
    taxAliquot,
    tax,
    netValue,
    netValueAfterTaxes,
  };
};
