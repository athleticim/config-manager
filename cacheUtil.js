const axios = require('axios');
const nodeCache = require('node-cache');
const myCache = new nodeCache();
const performance = require('perf_hooks').performance;
const { gitFileInitialUrl, gitToken } = require('./gitInfo');
const {getHost}=require('./setUtil');

async function fetchDefaultConfig() {
    try {
        const configUrl = `${gitFileInitialUrl}/config.json`;
        const defaultConfig = await axios.get(configUrl,
            {
                headers: {
                    'Authorization': `token ${gitToken}`,
                    Accept: 'application/vnd.github.v3+json',
                }
            });
        return defaultConfig.data;
    } catch (error) {
        return null;
    }
}

async function fetchHostConfig(host) {
    try {
        const hostName=getHost(host);
        const hostConfig =
            await axios.get(`$(gitFileInitialUrl}/${hostName}/config.json`,
                {
                    headers: {
                        Authorization: `token ${gitToken}`,
                        'Accept': 'application/vnd.github.v3+json',
                    }
                });
        return hostConfig.data;
    } catch (error) {
        return null;
    }
}
async function fetchEnvKeys(fileName) {
    try {
        const azureKeys = await axios.get(`${gitFileInitialUrl}/${fileName}`, {
            headers: {
                Authorization: `token ${gitToken}`,
                'Accept': 'application/vnd.github.v3+json',
            }
        }
        );

        return azureKeys.data;

    } catch (error) {
        return null;
    }
}

async function getAndSetConfigData(hostName) {
    const hostConfig = await getHostConfig(hostName);
    const defaultConfig = await getDefaultConfig();
    return { hostConfig, defaultConfig };
}

async function getHostConfig(hostName) {
    if (myCache.has('hostConfig')) {
        return myCache.get('hostConfig');
    } else {
        const hostConfigData = await fetchHostConfig(hostName);
        let cacheHostConfig = {};
        if (hostConfigData) {
            cacheHostConfig = hostConfigData;
            myCache.set('hostConfig', cacheHostConfig);
        }

        return cacheHostConfig;
    }
}

async function getDefaultConfig() {
    if (myCache.has('defaultConfig')) {
        return myCache.get('defaultConfig');
    } else {
        const defaultConfigData = await fetchDefaultConfig();
        let cacheDefaultConfig = {};
        if (defaultConfigData) {
            cacheDefaultConfig = defaultConfigData;
            myCache.set('defaultConfig', cacheDefaultConfig);
        }
        return cacheDefaultConfig;
    }
}

module.exports = {
    fetchDefaultConfig,
    fetchHostConfig,
    fetchEnvKeys,
    getDefaultConfig,
    getAndSetConfigData

}