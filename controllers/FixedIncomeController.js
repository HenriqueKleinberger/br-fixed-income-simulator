import { getFixedIncomeDataFromURL } from "../Services/FixedIncomeService.js";

class FixedIncomeController {
  async get(request, response) {
    const { body } = request;
    const result = await getFixedIncomeDataFromURL(body);
    return response.json(result);
  }

  async compare(request, response) {
    const {
      body: { codes, ...values },
    } = request;
    const treasuries = await Promise.all(
      codes.map(
        async (code) => await getFixedIncomeDataFromURL(code, ...values)
      )
    );

    return response.json({
      treasuries: treasuries.sort((a, b) => b.netValue - a.netValue),
    });
  }
}

export default FixedIncomeController;
