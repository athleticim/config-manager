const configValues={};
const azureVaultKeyNames=new Set();
const modifiedSecret=new Set();

function getConfigValueByKey(keyName){
    if(Object.prototype.hasOwnProperty.call(configValues, keyName)){
        return configValues[keyName];
    }else{
        return  process.env[keyName];
    }
}

function modifyAndCheckSecret(keyName){
    return modifiedSecret.has(keyName);
}


function setModifiedSecret(keyName){
    return modifiedSecret.add(keyName);
}

function checkAzureKey(keyName){
    return azureVaultKeyNames.has(keyName);
}

function setAzureKey(keyName){
    return azureVaultKeyNames.add(keyName);
}

function setConfigValueByKey(keyName , value){
    configValues[keyName]=value;
}

function resetConfigValueByKey(keyName){
    if(Object.prototype.hasOwnProperty.call(configValues, keyName)){
        delete configValues[keyName];
    }else{
         return null;
    }
}

function fetchEnvKeys(){
    return {
        hostName1:{
            host:"https://test1.academix.com"
        }
    }
}

module.exports={
    getConfigValueByKey,setConfigValueByKey,resetConfigValueByKey,
    checkAzureKey, setAzureKey,setModifiedSecret,fetchEnvKeys,modifyAndCheckSecret
}

