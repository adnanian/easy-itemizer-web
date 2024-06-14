
// CONSTANTS
const PACKAGE_JSON_FILEPATH = "./client/package.json";
const VITE_CONFIG_FILEPATH = "./client/vite.config.js";
const HELPERS_FILEPATH = "./client/src/helpser.js";
const API_URL = "http://127.0.0.1:5000";
const COMMENT_MARK = "// ";

/**
 * TODO
 * 
 * Article of reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
 */
const ConfigurationType = Object.freeze({
    DEVELOPMENT: "Development",
    PRODUCTION: "Production"
});

/**
 * TODO
 */
function invalidConfigTypeAlert() {
    throw new Error("Route configuration failed! Invalid program mode detected!");
}

/**
 * TODO
 * 
 * @param {*} fs 
 * @param {*} configType 
 */
function updateViteConfig(fs, configType) {
    fs.readFile(VITE_CONFIG_FILEPATH, "utf-8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        const dataArr = data.split('\n');
        let configLineIndex = 0;
        let proxyCommentIndex;
        let addCommentColIndex;
        let loopCondition;
        let updateLineFunction;
        switch (configType) {
            case ConfigurationType.DEVELOPMENT:
                proxyCommentIndex = dataArr.indexOf("    // proxy: {");
                loopCondition = (index) => {
                    return index < dataArr.length && dataArr[index].includes(COMMENT_MARK);
                } 
                addCommentColIndex = null;
                updateLineFunction = (line) => {
                    const commentIndex = line.indexOf(COMMENT_MARK);
                    return line.substring(0, commentIndex) + line.substring(commentIndex + COMMENT_MARK.length);
                }
                break;
            case ConfigurationType.PRODUCTION:
                proxyCommentIndex = dataArr.indexOf("    proxy: {");
                // Find the column index where the word proxy appears in the vite.config.js file.
                addCommentColIndex = dataArr[proxyCommentIndex].indexOf("proxy");
                loopCondition = (index) => {
                    index < dataArr.length && dataArr[index].length >= addCommentColIndex;
                };
                updateLineFunction = (line) => {
                    const newLine = line.substring(0, addCommentColIndex) + COMMENT_MARK + line.substring(addCommentColIndex);
                    console.log("New Line: ", newLine);
                    return newLine;
                }
                break;
            default:
                invalidConfigTypeAlert();
                break;
        }
        configLineIndex = proxyCommentIndex;
        while (loopCondition()) {
            //console.log(configLineIndex);
            dataArr[configLineIndex] = updateLineFunction(dataArr[configLineIndex]);
            configLineIndex++;
        }
        const newViteConfig = dataArr.join('\n');
        console.log(newViteConfig);
        fs.writeFile(VITE_CONFIG_FILEPATH, newViteConfig, "utf-8", function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("vite.config.js file updated successfully.");
        });
    });
}

/**
 * TODO
 * 
 * @param {*} fs 
 * @param {*} configType 
 */
function updatePackageJSON(fs, configType) {
    fs.readFile(PACKAGE_JSON_FILEPATH, 'utf-8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        
        const pkgJson = JSON.parse(data);
        switch (configType) {
            case ConfigurationType.DEVELOPMENT:
                delete pkgJson.proxy;
                break;
            case ConfigurationType.PRODUCTION:
                pkgJson.proxy = API_URL;
                break;
            default:
                invalidConfigTypeAlert();
                break;
        }

        fs.writeFile(PACKAGE_JSON_FILEPATH, JSON.stringify(pkgJson, null, 2), 'utf-8', function (err) {
            if (err) {
                return console.log(err);
            }
    
            console.log('Package.json file updated successfully!');
        });
    });
}

function updateHelpers() {
    // TODO
}

/**
 * TODO
 * 
 * We write our fetches to /api/route and it will go through this proxy
 * PROXY ONLY WORKS IN DEVELOPMENT AND WONT WORK IN PRODUCTION/DEPLOYED
 * 
 * DO NOT CALL THIS FUNCTION EXCEPT FROM SuperContext.jsx.
 * 
 * References:
 * https://stackoverflow.com/questions/10685998/how-to-update-a-value-in-a-json-file-and-save-it-through-node-js
 * https://stackoverflow.com/questions/62225160/how-can-i-modify-a-js-file-and-save-it-with-an-npm-command
 * https://www.geeksforgeeks.org/node-js-fs-writefile-method/
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
 * 
 */
function configureRoutes(configType) {
    const fs = require('fs');
    updateViteConfig(fs, configType);
    updatePackageJSON(fs, configType);
    // console.log("Current Directory: ", process.cwd());
    // switch (configType) {
    //     case ConfigurationType.DEVELOPMENT:
    //         fs.readFile(VITE_CONFIG_FILEPATH, "utf-8", function (err, data) {
    //             if (err) {
    //                 return console.log(err);
    //             }
    //             const dataArr = data.split('\n');
    //             const proxyCommentIndex = dataArr.indexOf("    // proxy: {");
    //             let configLineIndex = proxyCommentIndex;
    //             while (configLineIndex < dataArr.length && dataArr[configLineIndex].includes(COMMENT_MARK)) {
    //                 //console.log(configLineIndex);
    //                 const line = dataArr[configLineIndex];
    //                 const commentIndex = line.indexOf(COMMENT_MARK);
    //                 dataArr[configLineIndex] = line.substring(0, commentIndex) + line.substring(commentIndex + COMMENT_MARK.length);
    //                 configLineIndex++;
    //             }
    //             const newViteConfig = dataArr.join('\n');
    //             console.log(newViteConfig);
    //             fs.writeFile(VITE_CONFIG_FILEPATH, newViteConfig, "utf-8", function (err) {
    //                 if (err) {
    //                     return console.log(err);
    //                 }
    //                 console.log("vite.config.js file updated successfully.");
    //             });
    //         });
    //         fs.readFile(PACKAGE_JSON_FILEPATH, 'utf-8', function (err, data) {
    //             if (err) {
    //                 return console.log(err);
    //             }
                
    //             const pkgJson = JSON.parse(data);
    //             delete pkgJson.proxy;

    //             fs.writeFile(PACKAGE_JSON_FILEPATH, JSON.stringify(pkgJson, null, 2), 'utf-8', function (err) {
    //                 if (err) {
    //                     return console.log(err);
    //                 }
            
    //                 console.log('Package.json file updated successfully!');
    //             });
    //         });
    //         console.log("To be implemented.");
    //         break;
    //     case ConfigurationType.PRODUCTION:
    //         fs.readFile(PACKAGE_JSON_FILEPATH, 'utf-8', function (err, data) {
    //             if (err) {
    //                 return console.log(err);
    //             }
                
    //             const pkgJson = JSON.parse(data);
    //             pkgJson.proxy = API_URL;

    //             fs.writeFile(PACKAGE_JSON_FILEPATH, JSON.stringify(pkgJson, null, 2), 'utf-8', function (err) {
    //                 if (err) {
    //                     return console.log(err);
    //                 }
            
    //                 console.log('Package.json file updated successfully!');
    //             });
    //         });
    //         fs.readFile(VITE_CONFIG_FILEPATH, "utf-8", function (err, data) {
    //             if (err) {
    //                 return console.log(err);
    //             }
    //             const dataArr = data.split('\n');
    //             const proxyCommentIndex = dataArr.indexOf("    proxy: {");
    //             // Find the column index where the word proxy appears in the vite.config.js file.
    //             const addCommentColIndex = dataArr[proxyCommentIndex].indexOf("proxy");
    //             let configLineIndex = proxyCommentIndex;
    //             while (configLineIndex < dataArr.length && dataArr[configLineIndex].length >= addCommentColIndex) {
    //                 //console.log(configLineIndex);
    //                 const line = dataArr[configLineIndex];
    //                 dataArr[configLineIndex] = line.substring(0, addCommentColIndex) + COMMENT_MARK + line.substring(addCommentColIndex);
    //                 configLineIndex++;
    //             }
    //             const newViteConfig = dataArr.join('\n');
    //             console.log(newViteConfig);
    //             fs.writeFile(VITE_CONFIG_FILEPATH, newViteConfig, "utf-8", function (err) {
    //                 if (err) {
    //                     return console.log(err);
    //                 }
    //                 console.log("vite.config.js file updated successfully.");
    //             });
    //         });
    //         break;
    //     default:
    //         throw new Error("Route configuration failed! Invalid program mode detected!");
    // }
}

/**
 * https://www.npmjs.com/package/inquirer
 * https://stackoverflow.com/questions/58442756/nodejs-how-to-re-display-custom-cli-menu-after-executing-corresponding-function
 */
const inquirer = require('inquirer');
const configMenu = () => {
    inquirer.prompt([
        {
            name: 'configType',
            type: 'list',
            message: 'Select the configuration type: ',
            choices: ['Development', 'Production']
        }
    ]).then((answers) => {
        return configureRoutes(answers.configType);
    }).catch((error) => {
        console.error(error);
    });
}

configMenu();

// const showMenu = () => {
//     inquirer
//     .prompt([{
//         name: 'age',
//         type: 'input',
//         message: 'What\'s your age?',
//     }, {
//         name: 'country',
//         type: 'list',
//         message: 'Where do you live?',
//         choices: ['USA', 'China', 'Germany', 'France'],
//     }, {
//         name: 'back',
//         type: 'input',
//         message: 'Go again?',
//         choices: ['yes', 'no'],
//     }]
//     ).then((answers) => {
//         console.log(`\nMy age is ${answers.age} and I live in ${answers.country}.\n`);
//         if (answers.back === 'yes') {
//             return showMenu();
//         }
//     })
//     .catch((err) => {
//         console.log(err);
//     });
// }
//showMenu();
