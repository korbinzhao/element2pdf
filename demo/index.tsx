import React, { FunctionComponent } from "react";
import ReactDOM from "react-dom";
import Element2Pdf from '../src/index';

import './index.less';

const App: FunctionComponent = () => {

  return (
    <div className="container">
      <div className="download-btn"
        onClick={() => {
          new Element2Pdf({
            root: document.querySelector('.pdf-printer-container'),
            pageBreak: {
              className: 'page-break',
              type: 'before'
            }
          });
        }}>download pdf</div>
      <div className="pdf-printer-container">
        <div className="page">page111</div>
        <div className="page page-break">page222</div>
        <div className="page">page333</div>
        <div className="page">page444</div>
        <div className="page page-break">page555</div>
        <div className="page">page666</div>
      </div>
    </div>

  );
};

ReactDOM.render(<App />, document.getElementById("app"));
