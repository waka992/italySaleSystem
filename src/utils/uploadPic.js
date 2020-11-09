import OSS from 'ali-oss'

// 国内oss
let clientCN = new OSS({
    region: 'oss-cn-shenzhen',
    accessKeyId: 'LTAI4GCDDis5tRy7TrnpY9aN',
    accessKeySecret: 'wE3Wt0E1ZtJl53P8oVYt7Cb6kS9oiW',
    bucket: 'missbonbon-cn',
    endpoint: 'oss-accelerate.aliyuncs.com'
});

let clientCNGet = new OSS({
    region: 'oss-cn-shenzhen',
    accessKeyId: 'LTAI4GCDDis5tRy7TrnpY9aN',
    accessKeySecret: 'wE3Wt0E1ZtJl53P8oVYt7Cb6kS9oiW',
    bucket: 'missbonbon-cn',
})

// 海外oss
let clientEU = new OSS({
    region: 'oss-eu-central-1',
    accessKeyId: 'LTAI4GCDDis5tRy7TrnpY9aN',
    accessKeySecret: 'wE3Wt0E1ZtJl53P8oVYt7Cb6kS9oiW',
    bucket: 'missbonbon',
    endpoint: 'oss-accelerate.aliyuncs.com'
})

let clientEUGet = new OSS({
    region: 'oss-eu-central-1',
    accessKeyId: 'LTAI4GCDDis5tRy7TrnpY9aN',
    accessKeySecret: 'wE3Wt0E1ZtJl53P8oVYt7Cb6kS9oiW',
    bucket: 'missbonbon',
})

// aliyun.oss.cnPoint=oss-cn-shenzhen.aliyuncs.com
// aliyun.oss.cnbucketName=missbonbon-cn

/**
 * 
 * @param {*} file 文件对象
 * @param {*} fn 回调
 * @param {*} errfn 错误回调
 * @param {*} from 海外/海内
 */
const uploadPic = async (file, fn, errfn) => {
    let storeAs = '2020/' + file.name

    await clientEU.multipartUpload(storeAs, file).then((res) => {
        console.log('eu完成');
    }).catch(err => {
        errfn && errfn()
        console.error('eu 上传出错');
        console.log(err);
    })

    await clientCN.multipartUpload(storeAs, file).then((res) => {
        console.log('cn完成');
    }).catch(err => {
        errfn && errfn()
        console.error('cn 上传出错');
        console.log(err);
    })

    console.log('完成');
    let storeEUUrl = clientEUGet.signatureUrl(storeAs, {expires: 315360000}); // 10年有效期
    let storeCNUrl = clientCNGet.signatureUrl(storeAs, {expires: 315360000}); // 10年有效期
    fn && fn({euUrl: storeEUUrl, cnUrl: storeCNUrl}, storeAs)
}

export default uploadPic;
