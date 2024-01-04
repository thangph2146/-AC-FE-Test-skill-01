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
                    if (info.enterSearchTerm === '_id') {
                        fs.readFile("teams.json", "utf8", async function (err, teamsData) {
                            if (err) {
                                console.log("Error reading", err);
                            }
                            const newTeamsData = JSON.parse(teamsData)
                            const teamValue = () => {
                                return newTeamsData.filter(el => {
                                    return el._id.toString() === pressOption.enterSearchValue.toString()
                                })[0]

                            }
                            const nation_id = teamValue().nation_id
                            fs.readFile("nations.json", "utf8", function (err, nationsData) {
                                if (err) {
                                    console.log("Error reading", err);
                                }
                                const newNationsData = JSON.parse(nationsData)
                                const nationValue = () => {
                                    return newNationsData.filter(el => {
                                        return el._id.toString() === pressOption.enterSearchValue.toString()
                                    })[0]

                                }
                                fs.readFile("players.json", "utf8", function (err, playerData) {
                                    if (err) {
                                        console.log("Error reading", err);
                                    }
                                    const newPlayerData = JSON.parse(playerData)
                                    const playerValue = () => {
                                        return newPlayerData.filter(el => {
                                            return el.nation_id.toString() === nation_id.toString()
                                        })

                                    }
                                    Object.entries(teamValue()).map(el => {
                                        console.log(`${el[0]}: `, el[1]);
                                    })
                                    console.log('nation_name: ', nationValue().name);
                                    console.log('players: ', playerValue().map(el => el.name));


                                })
                            })



                        })
                    } else {
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

                                    console.log(`${info.enterSearchTerm.toString()}: `, pressOption.enterSearchValue.toString())
                                    console.log(`teams: `, newTeamsData.filter(el => {
                                        const newEl = Object.entries(el)
                                        return newEl.some(item => !!item[0] && !!item[1] && item[0].toString() === info.enterSearchTerm.toString() && item[1].toString() === pressOption.enterSearchValue.toString())
                                    }).map(el => el.name));
                                    console.log(`nations: `, newNationsData.filter(el => {
                                        const newEl = Object.entries(el)
                                        return newEl.some(item => !!item[0] && !!item[1] && item[0].toString() === info.enterSearchTerm.toString() && item[1].toString() === pressOption.enterSearchValue.toString())
                                    }).map(el => el.name));
                                    console.log(`players: `, newPlayerData.filter(el => {
                                        const newEl = Object.entries(el)
                                        return newEl.some(item => !!item[0] && !!item[1] && item[0].toString() === info.enterSearchTerm.toString() && item[1].toString() === pressOption.enterSearchValue.toString())
                                    }).map(el => el.name));

                                })

                            })
                        })


                    }
                }

            }
        })

    } catch (error) {
        console.log("Something went wrong!", error);
    }
}
