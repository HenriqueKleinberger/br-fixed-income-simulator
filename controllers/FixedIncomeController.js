import { setUp, tearDown } from "../config/puppetter.js";
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
} from "../utils/constants.js";

const getValueFromList = (list, label) =>
  list[list.findIndex((v) => v === label) + 1];

class FixedIncomeController {
  async get(request, response) {
    const {
      body: { code, value },
    } = request;

    await setUp();
    try {
      const page = await global.__BROWSER__.newPage();
      await page.goto(URL);
      await page.select(INPUT_TREASURE_TYPE, code);
      await page.$eval(
        INPUT_INVESTMENT_DATE,
        (el) => (el.value = "02/07/2021")
      );
      await page.$eval(
        INPUT_INVESTED_VALUE,
        (el, value) => (el.value = value),
        value
      );
      await page.$eval(INPUT_EARNING_RATE, (el) => (el.value = "8,75"));
      await page.$eval(INPUT_BANK_ADMIN_RATE, (el) => (el.value = "0"));
      await page.$eval(INPUT_SELIC_RATE, (el) => (el.value = "5"));
      await page.$eval(BUTTON_CALCULATE, (btn) => btn.click());
      await delay(300);

      const values = await page.evaluate((DATA_ROW_CLASS) => {
        const tds = Array.from(document.querySelectorAll(DATA_ROW_CLASS));
        return tds.map((td) => td.textContent);
      }, DATA_ROW_CLASS);

      tearDown();

      const daysBetweenInvestmentWithdraw = getValueFromList(
        values,
        LABEL_DAYS_BETWEEN_INVESTMENT_WITHDRAW
      );
      const taxAliquot = getValueFromList(values, LABEL_TAX_ALIQUOT);
      const tax = getValueFromList(values, LABEL_TAX);
      const netValue = getValueFromList(values, LABEL_NET_VALUE);
      const netValueAfterTaxes = getValueFromList(
        values,
        LABEL_NET_VALUE_AFTER_TAXES
      );
      const result = {
        daysBetweenInvestmentWithdraw,
        taxAliquot,
        tax,
        netValue,
        netValueAfterTaxes,
      };

      return response.json(result);
    } catch (err) {
      return response.json({ error: err.message, stack: err.stack });
    }
  }
}

export default FixedIncomeController;
