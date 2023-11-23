const { getAndSetConfigData } = require('./cacheUtil');

const getFetchedConfigs = async () => {
    const { hostConfig, defaultConfig } = await getAndSetConfigData();
    const fetchedConfigs = Object.assign({}, defaultConfig, hostConfig);
    return fetchedConfigs;
}


module.exports = {
    getFetchedConfigs
}