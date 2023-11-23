

if(process.env.NODE_ENV == 'development'){
    module.exports= require('./test/getConfigStub');
}else{
    module.exports =require('./getConfig');
}