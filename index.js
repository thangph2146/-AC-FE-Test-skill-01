
import chooseOptions from './chooseOptions.js'


export default async function App(externalFunction) {
    try {
        chooseOptions()
    } catch (error) {
        console.log(`Something Happened: ${error.message}`);
    }
}

App()