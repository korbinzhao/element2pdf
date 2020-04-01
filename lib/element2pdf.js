"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom.iterable");

var _jspdf = _interopRequireDefault(require("jspdf"));

var _html2canvas = _interopRequireDefault(require("html2canvas"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// device pixel ratio
const SCALE = 3; //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89; // params for element2pdf

/**
 * get all page break position
 * @param root html dom element
 * @param pageBreak page break params
 */
const getPageBreakPositions = (root, pageBreak) => {
  const pageBreakClassName = pageBreak.className,
        type = pageBreak.type; // root element px width

  const rootPxWidth = root.offsetWidth; // root element px height

  const rootPxHeight = root.offsetHeight;
  const groups = [];
  let groupIndex = 0;
  Array.from(root.children).forEach((child, childIndex) => {
    groups[groupIndex] = groups[groupIndex] || [];
    groups[groupIndex].push(child);

    if (child.classList.contains(pageBreakClassName)) {
      groupIndex++;
    }
  });
  return groups;
};
/**
 * generate a pdf file
 * @param root html dom element
 * @param filename file name
 */


const genPdf = (root, filename) => {
  (0, _html2canvas.default)(root, {
    scale: SCALE
  }).then(canvas => {
    const contentWidth = canvas.width;
    const contentHeight = canvas.height;
    let yPosition = 0;
    const doc = new _jspdf.default("", "pt", "a4"); //一页pdf显示html页面生成的canvas高度;

    const pageHeight = contentWidth / A4_WIDTH * A4_HEIGHT;
    let leftHeight = contentHeight;
    const imgWidth = A4_WIDTH;
    const imgHeight = A4_WIDTH / contentWidth * contentHeight;
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
};

const html2pdf = options => {
  const root = options.root,
        pageBreak = options.pageBreak,
        filename = options.filename;

  const _ref = pageBreak || {},
        pageBreakClassName = _ref.className;

  if (pageBreakClassName) {}

  genPdf(root, filename);
};

html2pdf.defaultProps = {
  pageBreak: {
    className: 'page-break',
    type: 'after'
  }
};
var _default = html2pdf;
exports.default = _default;