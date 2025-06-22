import chalk from 'chalk';
import { writeToFile } from './fileIO.js';
import { convertJSONToCSV, convertXLSXToJSON } from './csv.js';

const convert = async () => {
  try {
    const jsonData = await convertXLSXToJSON('sample.xlsx');

    // process and polish the json items here if needed before next stage.
    // Remember that convertJSONToCSV accepts an array of jsons. [ {}, {} ]

    const csvData = await convertJSONToCSV(jsonData);

    await writeToFile('Output.csv', csvData);
  } catch (error) {
    console.error(chalk.red('Error during conversion:'), error);
    process.exit(1);
  }
};

const main = async () => {
  await convert();
  console.log(chalk.magenta('Done...'));
  process.exit(0);
};

main();
