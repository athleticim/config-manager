const azureVaultKeyNames= new Set();
const modifiedSecret=new Set();

const setKeyNames=(array)=>{
    for(const name of array){
        azureVaultKeyNames.add(name);
    }
}

const hasKeyName=(keyName)=>{
    if(azureVaultKeyNames.has(keyName)){
        return true;
    }

    return false;
}


const hasSecretName= (keyName)=>{
    if(modifiedSecret.has(keyName)){
        return true;
    }
    return false;
}

const checkSize= ()=>{
    return azureVaultKeyNames.size;
}

const checkModifiedSetSize= ()=>{
    return modifiedSecret.size;
}

const setModifiedSecretName=(array)=>{
    for(const name of array){
        const replacer=new RegExp('_', 'g');
        const modifiedName=name.replace(replacer, '-');
        modifiedName.add(modifiedName);
    }
}
function getHost(hostParam){
    return hostParam || getEnvHost();
}
function getEnvHost(){
    const url=new URL(process.env.hostUrl);
     return String(url.hostname).split('.')[0];
}
module.exports={
    setKeyNames,
    hasKeyName,
    checkSize,
    checkModifiedSetSize,
    hasSecretName,
    setModifiedSecretName,
    getHost
}