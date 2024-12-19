const express = require('express');
const app = express();

app.use(express.json());

//ROMAN NUMERAL TO ARABIC FUNCTION
function romanToArabic (numeral) {

  const romanRegex = /^(M{0,3})(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;

  if (!romanRegex.test(numeral)) {
    throw new Error("Invalid Roman numeral.");
  }

  const translator = {
    'I': 1, 
    'V': 5, 
    'X': 10,
    'L': 50,
    'C': 100, 
    'D': 500,
    'M': 1000
  };

  let total = 0;
  let prevVal = 0;

  for (let item of numeral) {
    let currentVal = translator[item];

    // if previous < current, subtract twice
    if (prevVal < currentVal) total += currentVal - (prevVal*2);
    else total += currentVal;

    prevVal = currentVal;
  }

  return total;
}

//POST ENDPOINT
app.post("/functions/romanToArabic", (req, res) => {
  const { input } = req.body;

  if (!input || typeof input !== "string") {
    return res.status(400).send({ error: "Invalid input. Please provide a Roman numeral as a string." });
  }

  try {
    const output = romanToArabic(input.toUpperCase());
    res.send({ output });
  } catch (err) {
    res.status(500).send({ error: "An error occurred while processing your request." });
  }
});

//GET - API DOCUMENTATION 
app.get("functions/romanToArabic", (req, res) => {
  const docs = {
    name: "romanToArabic",
    description: "Converts a Roman numeral to an Arabic numeral.",
    input: {
      type: "string",
      description: "A valid Roman numeral.",
      example: "XIV",
    },
    output: {
      type: "number",
      description: "The Arabic equivalent of the provided Roman numeral.",
      example: 14,
    },
  };
  res.send(docs);
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
});