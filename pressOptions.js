import inquirer from "inquirer";
import selectOptions from './selectOptions.js'
import { exit } from "process";


export default async function pressOptions(info) {
    try {
        console.log(`\n\ Select search options:\n\ 
        - Press 1 to search \n\ 
        - Press 2 to view a list of searchable fields \n\ 
        - Type 'quit' to exit\n\ `)

        const answers = await inquirer.prompt([
            { type: 'input', name: 'pressOptions', message: `` }
        ])
        const pressOption = {
            pressOptions: answers.pressOptions
        }
        if (pressOption.pressOptions === '') {
            console.debug(`\n\ You don't press any options please try again`)
            pressOptions()
        }
        else if (pressOption.pressOptions === 'quit') {
            exit()
        } else {
            if (['1', '2'].includes(pressOption.pressOptions)) {
                selectOptions(pressOption)
            } else {
                console.debug(`\n\ You press wrong options please try again`)
                pressOptions()
            }

        }

    } catch (error) {
        console.log("Something went wrong!", error);
    }
}
