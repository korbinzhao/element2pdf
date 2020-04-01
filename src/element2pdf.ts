import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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
  main() {
    const { pageBreak } = this.options;
    const { className: pageBreakClassName } = pageBreak || {};

    if (pageBreakClassName) {
      const groups = this.getPageBreakPositions();

      console.log('--- groups ---', groups);
    }

    this.genPdf();

  }

  /**
   * get all page break position
   */
  getPageBreakPositions() {
    const { root, pageBreak } = this.options;
    const { className: pageBreakClassName, type } = pageBreak;

    // root element px width
    const rootPxWidth = root.offsetWidth;
    // root element px height
    const rootPxHeight = root.offsetHeight;

    const groups = [];
    let groupIndex = 0;

    Array.from(root.children).forEach((child: HTMLElement, childIndex) => {
      groups[groupIndex] = groups[groupIndex] || [];

      groups[groupIndex].push({
        pageIndex: groupIndex,
        ele: child,
        position: {
          top: child.offsetTop / rootPxHeight,
          left: child.offsetLeft / rootPxWidth
        }
      });

      if (child.classList.contains(pageBreakClassName)) {
        groupIndex++;
      }
    });

    return groups;
  }

  /**
   * generate a pdf file
   */
  genPdf() {
    const { root, filename } = this.options;

    html2canvas(root, { scale: SCALE }).then(canvas => {
      const contentWidth = canvas.width;
      const contentHeight = canvas.height;

      let yPosition = 0;

      const doc = new jsPDF("", "pt", "a4");

      //一页pdf显示html页面生成的canvas高度;
      const pageHeight = (contentWidth / A4_WIDTH) * A4_HEIGHT;

      let leftHeight = contentHeight;

      const imgWidth = A4_WIDTH;
      const imgHeight = (A4_WIDTH / contentWidth) * contentHeight;

      const img = canvas.toDataURL("image/jpeg", 1.0);

      while (leftHeight > 0) {
        doc.addImage(img, "jpeg", 0, yPosition, imgWidth, imgHeight);
        yPosition -= A4_HEIGHT;
        leftHeight -= pageHeight;

        if (leftHeight > 0) {
          doc.addPage();
        }
      }

      doc.save(filename || "sample.pdf");

    });

  }

}


export default Element2Pdf;
