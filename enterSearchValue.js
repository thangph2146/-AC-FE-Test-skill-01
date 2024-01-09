import inquirer from "inquirer";
import { exit } from "process";
import fs from "fs";


export default async function enterSearchValue(info) {
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
                    ? Object.values(JSON.parse(data))
                        .map((key) => {
                            return Object.entries(key)
                                .map((value) => {
                                    return (
                                        value.includes(info.enterSearchTerm) &&
                                        value[1] &&
                                        value[1].toString()
                                    );
                                })
                                .filter((value) => value !== false && value);
                        })
                        .flat(1)
                        .filter(function (elem, index, self) {
                            return index === self.indexOf(elem);
                        })
                        .map((value) => {
                            return value.toString();
                        })
                    : [];
            console.log(`\n\ `)
            console.log(`Enter value at below:`)
            console.log(fields.length > 0 ? fields : 'No value can suggest!')
            const answers = await inquirer.prompt([
                { type: 'input', name: 'enterSearchValue', message: `Enter search value: ` }
            ])
            const pressOption = {
                enterSearchValue: answers.enterSearchValue.toString().trim()
            }
            if (pressOption.enterSearchValue === '') {
                console.log(`\n\ `)
                console.debug(`Note: You don't enter any options please try again`)
                enterSearchValue(info)
            }
            else if (pressOption.enterSearchValue === 'quit') {
                exit()
            } else {
                if (!fields.includes(pressOption.enterSearchValue)) {
                    console.log(`\n\ `)
                    console.debug(`Note: Value you enter don't have in options please try again`)
                    enterSearchValue(info)
                } else {
                    console.log(`=> Result:`);

                    fs.readFile("nations.json", "utf8", async function (err, nationsData) {
                        if (err) {
                            console.log("Error reading", err);
                        }
                        const newNationsData = JSON.parse(nationsData)
                        fs.readFile("teams.json", "utf8", function (err, teamsData) {
                            if (err) {
                                console.log("Error reading", err);
                            }
                            const newTeamsData = JSON.parse(teamsData)

                            fs.readFile("players.json", "utf8", function (err, playerData) {
                                if (err) {
                                    console.log("Error reading", err);
                                }
                                const newPlayerData = JSON.parse(playerData)
                                const indexOfData = info.dataChoosing.findIndex(x => x[info.enterSearchTerm].toString() === pressOption.enterSearchValue.toString())
                                const dataChoosing = info.dataChoosing[indexOfData]
                                Object.entries(dataChoosing).map((item) => {
                                    console.log(`${item[0].toString()}: ${item[1].toString()}`)
                                })

                                info.selectOptions !== '2' && (dataChoosing._id || dataChoosing.nation_id) && console.log(`teams_name: `,
                                    newTeamsData.find(x => dataChoosing._id === x._id || dataChoosing.nation_id === x.nation_id).name
                                );
                                info.selectOptions !== '3' && dataChoosing._id && console.log(`nations_name: `,
                                    newNationsData.find(x => dataChoosing._id === x._id).name
                                );
                                info.selectOptions !== '1' && dataChoosing.nation_id && console.log(`players: `, newPlayerData.filter(el => {
                                    return el.nation_id.toString() === dataChoosing.nation_id.toString()
                                }
                                ).map(el => el.name));

                            })

                        })
                    })


                }
            }


        })

    } catch (error) {
        console.log("Something went wrong!", error);
    }
}
