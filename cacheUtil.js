const axios = require('axios');
const nodeCache = require('node-cache');
const myCache = new nodeCache();
const performance = require('perf_hooks').performance;
const { gitFileInitialUrl, gitToken } = require('./gitInfo');

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

async function fetchHostConfig() {
    try {
        const url = new URL(process.env.hostUrl);
        const hostName = String(url.hostname).split('.')[0];
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

async function getAndSetConfigData() {
    const hostConfig = await getHostConfig();
    const defaultConfig = await getDefaultConfig();
    return { hostConfig, defaultConfig };
}

async function getHostConfig() {
    if (myCache.has('hostConfig')) {
        return myCache.get('hostConfig');
    } else {
        const hostConfigData = await fetchHostConfig();
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
        const defaultConfig = await fetchDefaultConfig();
        let cacheDefaultConfig = {};
        if (defaultConfigData) {
            cacheDefaultConfig = defaultConfig;
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