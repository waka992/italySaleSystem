// import JsEncrypt from 'jsencrypt'

// let publicKey = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCJ9s1qlOyv9qpuaTqauW6fUftzE50rVk3yVPZwv1aO1Ch-----END PUBLIC KEY-----'
let publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCJ9s1qlOyv9qpuaTqauW6fUftzE50rVk3yVPZwv1aO1Ch'
let privateKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCJ9s1qlOyv9qpuaTqauW6fUftzE50rVk3yVPZwv1aO1Ch'
const RSA =  {
    //加密方法
    RSAencrypt(pas){
    //实例化jsEncrypt对象
    let jse = new JSEncrypt();
    //设置公钥
    jse.setPublicKey(publicKey);
    // console.log('加密：'+jse.encrypt(pas))
    return jse.encrypt(pas);
    },
      
    //解密方法
      RSAdecrypt(pas){
        let jse = new JSEncrypt();
        // 私钥
        jse.setPrivateKey(privateKey)
        // console.log('解密：'+jse.decrypt(pas))
        return jse.decrypt(pas);
      }
}

export default RSA;
