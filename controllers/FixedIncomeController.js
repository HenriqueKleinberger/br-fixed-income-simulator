import { getFixedIncomeDataFromURL } from "../Services/FixedIncomeService.js";

class FixedIncomeController {
  async get(request, response) {
    const {
      body: { code, value },
    } = request;
    const result = await getFixedIncomeDataFromURL({ code, value });
    return response.json(result);
  }

  async compare(request, response) {
    const {
      body: { codes, value },
    } = request;
    const treasuries = await Promise.all(
      codes.map(
        async (code) => await getFixedIncomeDataFromURL({ code, value })
      )
    );

    return response.json({
      treasuries: treasuries.sort((a, b) => b.netValue - a.netValue),
    });
  }
}

export default FixedIncomeController;
