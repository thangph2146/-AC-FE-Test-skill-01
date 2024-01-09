import inquirer from "inquirer";
import { exit } from "process";
import enterSearchValue from './enterSearchValue.js'
import fs from "fs";


export default async function enterSearchTerm(info) {
    try {

        const dataFile = (type) => {
            switch (type) {
                case "1":
                    return "players.json"
                    break;
                case "2":
                    return "teams.json"
                    break;
                case "3":
                    return "nations.json"
                    break;
                default:
                    return;

            }
        }
        fs.readFile(dataFile(info.selectOptions), "utf8", async function (err, data) {
            if (err) {
                console.log("Error reading", err);
            }
            const fields =
                JSON.parse(data).length > 0
                    ? Object.keys(JSON.parse(data)[0]).map((key) => {
                        return key.toString();
                    })
                    : [];


            console.log(`\n\ `)
            console.log(`Enter term at below:`)
            console.log(fields)

            const answers = await inquirer.prompt([
                { type: 'input', name: 'enterSearchTerm', message: `Enter search term: ` }
            ])
            const pressOption = {
                enterSearchTerm: answers.enterSearchTerm.toString().trim(),
                selectOptions: info.selectOptions,
            }
            if (pressOption.enterSearchTerm === '') {
                console.debug(`\n\ Note: You don't enter any options please try again`)
                enterSearchTerm(info)
            }
            else if (pressOption.enterSearchTerm === 'quit') {
                exit()
            } else {
                if (!fields.includes(pressOption.enterSearchTerm)) {
                    console.debug(`\n\ Note: Value you enter don't have in options please try again`)
                    enterSearchTerm(info)
                } else {
                    const fieldsObject =
                        JSON.parse(data).length > 0
                            ? (JSON.parse(data))
                            : [];

                    enterSearchValue({ ...pressOption, dataChoosing: fieldsObject })
                }

            }
        })

    } catch (error) {
        console.log("Something went wrong!", error);
    }
}
