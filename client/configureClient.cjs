
// CONSTANTS

/** The location of the file: vite.config.js, starting from root. */
const VITE_CONFIG_FILEPATH = "./client/vite.config.js";

/** The location of package.json, starting from root. */
const PACKAGE_JSON_FILEPATH = "./client/package.json";

/** The location of helpers.js, starting from root. */
const HELPERS_FILEPATH = "./client/src/helpers.js";

/** The backend url. */
const API_URL = "http://127.0.0.1:5000";

/** Line comment. */
const COMMENT_MARK = "// ";

/**
 * Constants representing the different route configuration types for this application.
 * 
 * Article of reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
 */
const ConfigurationType = Object.freeze({
    /** Represents this application currently being developed and run locally. */
    DEVELOPMENT: "Development",
    /** Represents this application is live on the internet, and that anyone can access it now. */
    PRODUCTION: "Production"
});

/**
 * Throws an error message if, somehow an invalid configuration type was passed into the update functions.
 * Although, this should most likely not happen, as the user is restricted to selecting two options.
 */
function invalidConfigTypeAlert(configType) {
    throw new Error("Route configuration failed! Invalid program mode detected!", configType);
}

/**
 * Adjusts the route settings on vite.config.js according to the desired configuration type.
 * 
 * If the developer is configuring for DEVELOPMENT, then the proxy key and value in the
 * file will be commented back in.
 * 
 * If the developer is configuring for PRODUCTION, then the proxy key and value in the file
 * will be commented out.
 * 
 * @param {*} fs the file system.
 * @param {String} configType the configuration type.
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
                    return index < dataArr.length && dataArr[index].length >= addCommentColIndex;
                };
                updateLineFunction = (line) => {
                    const newLine = line.substring(0, addCommentColIndex) + COMMENT_MARK + line.substring(addCommentColIndex);
                    // console.log("New Line: ", newLine);
                    return newLine;
                }
                break;
            default:
                invalidConfigTypeAlert();
                break;
        }
        configLineIndex = proxyCommentIndex;
        while (loopCondition(configLineIndex)) {
            //console.log(configLineIndex);
            dataArr[configLineIndex] = updateLineFunction(dataArr[configLineIndex]);
            configLineIndex++;
        }
        const newViteConfig = dataArr.join('\n');
        // console.log(newViteConfig);
        fs.writeFile(VITE_CONFIG_FILEPATH, newViteConfig, "utf-8", function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("vite.config.js file updated successfully.");
        });
    });
}

/**
 * Adjusts the route settings on package.json according to the desired configuration type.
 * 
 * If the developer is configuring for DEVELOPMENT, then the proxy key and value in the
 * file will be removed.
 * 
 * If the developer is configuring for PRODUCTION, then the proxy key and value, which is
 * the API URL, will be added back in.
 * 
 * @param {*} fs the file system.
 * @param {String} configType the configuration type.
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


/**
 * Adjusts the route settings on helpers.js according to the desired configuration type.
 * 
 * If the developer is configuring for DEVELOPMENT, then the routePrefix constant will be
 * set to "/api".
 * 
 * If the developer is configuring for PRODUCTION, then the routePrefix constant will be
 * set to an empty string.
 * 
 * @param {*} fs the file system.
 * @param {String} configType the configuration type.
 */
function updateHelpers(fs, configType) {
    fs.readFile(HELPERS_FILEPATH, "utf-8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        let newRoutePrefix;
        switch (configType) {
            case ConfigurationType.DEVELOPMENT:
                newRoutePrefix = "\"/api\"";
                break;
            case ConfigurationType.PRODUCTION:
                newRoutePrefix = "\"\"";
                break;
            default:
                invalidConfigTypeAlert();
        }

        const dataArr = data.split('\n');
        for (let lineIndex = 0; lineIndex < dataArr.length; lineIndex++) {
            // console.log(lineIndex);
            if (dataArr[lineIndex].includes("const routePrefix")) {
                dataArr[lineIndex] = `const routePrefix = ${newRoutePrefix}`;
                break;
            }
        }

        const updatedHelperData = dataArr.join('\n');
        fs.writeFile(HELPERS_FILEPATH, updatedHelperData, "utf-8", function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("helpers.js file updated successfully.");
        });
    });
}

/**
 * Configures route settings on the front end.
 * First, it will update the vite.config.js file.
 * Then, it will update the package.json file.
 * Finally, it will update the helpers.js file.
 * 
 * References below:
 * 
 * @see
 * https://stackoverflow.com/questions/10685998/how-to-update-a-value-in-a-json-file-and-save-it-through-node-js
 * https://stackoverflow.com/questions/62225160/how-can-i-modify-a-js-file-and-save-it-with-an-npm-command
 * https://www.geeksforgeeks.org/node-js-fs-writefile-method/
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
 * 
 * 
 * @param {*} configType the configuration type.
 */
function configureRoutes(configType) {
    const fs = require('fs');
    updateViteConfig(fs, configType);
    updatePackageJSON(fs, configType);
    updateHelpers(fs, configType);
}

/**
 * Menu for developers to select the appropriate configuration type.
 * Selecting Development will configure route settings so that you can test this application on a development environment.
 * Selecting Production will configure route settings so that you can deploy this application and run it live.
 * 
 * References below:
 * 
 * @see
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
