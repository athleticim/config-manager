const { getAndSetConfigData, fetchEnvKeys } = require('./cacheUtil')
const performance = require('perf_hooks').performance;
const { setKeyNames, hasKeyName, checkSize,
    checkModifiedSetSize, setModifiedSecretName, hasSecretName } = require('./setUtil')


const getConfigValueByKey = async (key) => {
    if (process.env[key] != undefined) {
        return process.env[key];
    }
    const value = await checkAndReturnValue(key);
    if (value) {
        return value;
    } else {
        return undefined;
    }
}

async function checkAndReturnValue(key) {
    const { hostConfig, defaultConfig } = await getAndSetConfigData();
    if (hostConfig[key] != null) {
        return hostConfig[key];
    } else if (defaultConfig[key] != null) {
        return defaultConfig[key];
    }

    return null;
}

const checkAzureKey = async (key) => {
    if (checkSize() == 0) {
        const listOfKeys = await fetchEnvKeys('env_keys.json');
        if (listOfKeys != null) {
            setKeyNames(listOfKeys['keys']);
        }
    }

    return hasKeyName(key);
}

const modifyAndCheckSecret = async (key) => {
    if (checkModifiedSetSize() == 0) {
        const listOfKeys = await fetchEnvKeys('env_keys.json');
        if (listOfKeys != null) {
            setModifiedSecretName(listOfKeys['keys']);
        }
    }
    const replacer = new RegExp('_', 'g');
    return hasKeyName(key.replace(replacer, '-'));
}


module.exports = { getConfigValueByKey, checkAzureKey,
     modifyAndCheckSecret, fetchEnvKeys }