import inquirer from "inquirer";
import pressOptions from './pressOptions.js'
import { exit } from "process";
// import fs from "fs";
// import { v4 as uuidv4 } from "uuid";
// import queryDB from "./queryDB.js";


export default async function chooseOptions(info) {
    try {
        const answers = await inquirer.prompt([
            { type: 'input', name: 'pressOptions', message: `Type 'quit' to exit at any time. Press 'Enter' to continue: ` }
        ])
        const pressOption = {
            pressOptions: answers.pressOptions
        }
        if (pressOption.pressOptions === 'quit') {
            exit()
        } else {
            pressOptions()
        }

    } catch (error) {
        console.log("Something went wrong!", error);
    }
}
