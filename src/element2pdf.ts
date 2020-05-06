import jsPDF from "jspdf";
import domtoimage from 'components/dom-to-image/src/dom-to-image.js';

import { Options } from './types';

// device pixel ratio
const SCALE = 3;

//A4 size [595.28,841.89]
const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;

/**
 * transform html element to pdf
 */
class Element2Pdf {

  constructor(options: Options) {
    this.options = options;
    this.main();
  }

  options: Options = {
    root: null,
    pageBreak: {
      className: 'page-break',
      type: 'after'
    }
  }

  /**
   * entry function
   */
  main(): void{
    const { pageBreak } = this.options;
    const { className: pageBreakClassName } = pageBreak || {};

    if (pageBreakClassName) {
      this.addPageBreakSpace();
    }

    setTimeout(() => {
      this.genPdf();
    }, 1000)


  }

  /**
   * insert space to page break in order to full page
   */
  addPageBreakSpace(): void{
    const { root, pageBreak } = this.options;
    const { className: pageBreakClassName, type } = pageBreak || {};

    // root element px width
    const rootPxWidth = root.offsetWidth;
    // // root element px height
    // const rootPxHeight = root.offsetHeight;

    const pagePxHeight = A4_HEIGHT / A4_WIDTH * rootPxWidth;

    Array.from(document.querySelectorAll(`.${pageBreakClassName}`)).forEach(((element: HTMLElement, index) => {
      const styles = window.getComputedStyle(element);
      var marginTop = parseFloat(styles['marginBottom']);

      // 获取分页间隔处离页面顶部的px高度
      const pageBreakTop = (type === 'before' ? element.offsetTop : element.offsetTop + element.offsetHeight + marginTop)
        - root.offsetTop;

      // 计算要在分割处插入间隔div元素的高度
      const spaceHeight = pagePxHeight * (index + 1) - pageBreakTop;

      if (spaceHeight > 0) {
        const spaceEle = document.createElement('div');
        spaceEle.classList.add('element2pdf-page-break-space');
        spaceEle.style.height = spaceHeight + 'px';

        if (type === 'before') {
          element.parentElement.insertBefore(spaceEle, element);
        } else {
          element.parentElement.insertBefore(spaceEle, element.nextSibling);
        }
      }

    }));
  }

  savePdfWithPageBreak(img, imgWidth, imgHeight, contentWidth, contentHeight): void{

    const { filename } = this.options;

    const doc = new jsPDF("", "pt", "a4");

    let yPosition = 0;
    let leftHeight = contentHeight;
    const PAGE_GAP = SCALE * 10;

    //一页pdf显示html页面生成的canvas高度;
    const pageHeight = (contentWidth / A4_WIDTH) * A4_HEIGHT;

    while (leftHeight > 0) {
      doc.addImage(img, "jpeg", 0, yPosition, imgWidth, imgHeight);
      yPosition -= A4_HEIGHT;
      leftHeight -= (pageHeight + PAGE_GAP * 2);

      if (leftHeight > 0) {
        doc.addPage();
      }
    }

    doc.save(filename || "download.pdf");
  }

  savePdfWithoutPageBreak(img, imgWidth, imgHeight, contentWidth, contentHeight): void {
    const { filename } = this.options;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [imgWidth, imgHeight]
    });

    doc.addImage(img, "jpeg", 0, 0, imgWidth, imgHeight);

    doc.save(filename || "download.pdf");
  }

  /**
   * generate a pdf file
   */
  genPdf(): void{
    const { root, filename, pageBreak } = this.options;

    // hack the html2canvas problem: https://github.com/niklasvh/html2canvas/issues/1878
    window.scrollTo(0, 0);

    domtoimage.toCanvas(root)
      .then((canvas) => {

        const contentWidth = canvas.width;
        const contentHeight = canvas.height;
    
        const imgWidth = A4_WIDTH;
        const imgHeight = (A4_WIDTH / contentWidth) * contentHeight;
    
        const img = canvas.toDataURL("image/jpeg", 1.0);

        if(pageBreak){
          this.savePdfWithPageBreak(img, imgWidth, imgHeight, contentWidth, contentHeight);
        } else {
          this.savePdfWithoutPageBreak(img, imgWidth, imgHeight, contentWidth, contentHeight);
        }
        
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
   
  }

}


export default Element2Pdf;
