import inquirer from "inquirer";
import enterSearchTerm from './enterSearchTerm.js'
import { exit } from "process";
import fs from "fs";

export default async function selectOptions(info) {
    try {
        console.log(`\n\ Select options:\n\ 
        - Select 1: Player \n\ 
        - Select 2: Teams \n\ 
        - Select 3: Nations \n\ `)
        const answers = await inquirer.prompt([
            { type: 'input', name: 'selectOptions', message: `` }
        ])
        const pressOption = {
            selectOptions: answers.selectOptions
        }
        if (pressOption.selectOptions === '') {
            console.debug(`\n\ You don't select any options please try again`)
            selectOptions(info)
        }
        else if (pressOption.selectOptions === 'quit') {
            exit()
        } else if (!['1', '2', '3'].includes(pressOption.selectOptions)) {
            console.debug(`\n\ You select wrong options please try again`)
            selectOptions(info)
        } else {
            if (info.pressOptions === '1') {
                enterSearchTerm(pressOption)
            } else if (info.pressOptions === '2') {
                const dataFile = (type) => {
                    switch (type) {
                        case "1":
                            return { data: "players.json", name: "Players" }
                            break;
                        case "2":
                            return { data: "teams.json", name: "Teams" }
                            break;
                        case "3":
                            return { data: "nations.json", name: "Nations" }
                            break;
                        default:
                            return;

                    }
                }
                fs.readFile(dataFile(pressOption.selectOptions).data, "utf8", async function (err, data) {
                    if (err) {
                        console.log("Error reading", err);
                    }
                    const fields =
                        JSON.parse(data).length > 0
                            ? Object.keys(JSON.parse(data)[0]).map((key) => {
                                return key.toString();
                            })
                            : [];
                    console.log(`\n\ => Result: \n\ Search ${dataFile(pressOption.selectOptions).name} with: \n\ `);
                    fields.map(field => {
                        console.log(` ${field}`);
                    })

                })
            }
        }

    } catch (error) {
        console.log("Something went wrong!", error);
    }
}
