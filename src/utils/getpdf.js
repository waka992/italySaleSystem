import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
const pdfservice = (targetId, pdfname, width, height,) => {
    let tar = document.querySelector(targetId)

    if (!width) {
        width = tar.offsetWidth
    }
    if (!height) {
        height = tar.offsetHeight
    }
    html2canvas(tar, {
        width: width,
        height: height,
        scale: 1,
    }).then(function(canvas) {
        console.log(canvas);
        let pageData = canvas.toDataURL( 'image/jpeg', 1.0);// 画布转为图片
        let pdf = new jsPDF('l', 'pt', [canvas.width, canvas.height], false, false, 16, 1.0, ["px_scaling"]);// 生成pdf对象,方向默认竖直，尺寸ponits，格式a4[595.28,841.89]
        pdf.addImage(pageData, 'JPEG', 0, 0, canvas.width, canvas.height); // addImage后两个参数控制添加图片的尺寸，此处将页面高度按照a4纸宽高比列进行压缩
        // pdf.addHTML(pageData); // addImage后两个参数控制添加图片的尺寸，此处将页面高度按照a4纸宽高比列进行压缩
        pdf.save(pdfname + '.pdf'); // 文件名可以自己取一个
    })
}


export default pdfservice;
