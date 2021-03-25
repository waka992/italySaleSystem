// var key = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");
// var iv = CryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");
var key = CryptoJS.enc.Latin1.parse("missboomboom1234");
var iv = CryptoJS.enc.Latin1.parse("missboomboom1234");
import CryptoJS from 'crypto-js'
const RSA =  {
    EncryptData: function(data) {
      var srcs = CryptoJS.enc.Utf8.parse(data);
      var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      return encrypted.toString()
    },

    DecryptData: function(data) {
      var decrypt = CryptoJS.AES.decrypt(data, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      var result = JSON.parse(CryptoJS.enc.Utf8.stringify(decrypt).toString())
      return result
    },
}

export default RSA;
