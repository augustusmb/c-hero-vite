import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PropTypes } from "prop-types";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import class3b_a from "./assets/c-hero-classes/3b/3b_a.pdf";
import class3b_b from "./assets/c-hero-classes/3b/3b_b.pdf";
import class3b_c from "./assets/c-hero-classes/3b/3b_c.pdf";
import class3b_d from "./assets/c-hero-classes/3b/3b_d.pdf";
import class3f_a from "./assets/c-hero-classes/3f/3f_a.pdf";
import class3f_b from "./assets/c-hero-classes/3f/3f_b.pdf";
import class3f_c from "./assets/c-hero-classes/3f/3f_c.pdf";
import class3f_d from "./assets/c-hero-classes/3f/3f_d.pdf";
import class5b_a from "./assets/c-hero-classes/5b/5b_a.pdf";
import class5b_b from "./assets/c-hero-classes/5b/5b_b.pdf";
import class5b_c from "./assets/c-hero-classes/5b/5b_c.pdf";
import class5b_d from "./assets/c-hero-classes/5b/5b_d.pdf";
import class5f_a from "./assets/c-hero-classes/5f/5f_a.pdf";
import class5f_b from "./assets/c-hero-classes/5f/5f_b.pdf";
import class5f_c from "./assets/c-hero-classes/5f/5f_c.pdf";
import class5f_d from "./assets/c-hero-classes/5f/5f_d.pdf";
import class7b_a from "./assets/c-hero-classes/7b/7b_a.pdf";
import class7b_b from "./assets/c-hero-classes/7b/7b_b.pdf";
import class7b_c from "./assets/c-hero-classes/7b/7b_c.pdf";
import class7b_d from "./assets/c-hero-classes/7b/7b_d.pdf";
import class7f_a from "./assets/c-hero-classes/7f/7f_a.pdf";
import class7f_b from "./assets/c-hero-classes/7f/7f_b.pdf";
import class7f_c from "./assets/c-hero-classes/7f/7f_c.pdf";
import class7f_d from "./assets/c-hero-classes/7f/7f_d.pdf";
import class9r_a from "./assets/c-hero-classes/9r/9r_a.pdf";
import class9r_b from "./assets/c-hero-classes/9r/9r_b.pdf";
import class9r_c from "./assets/c-hero-classes/9r/9r_c.pdf";
import class9r_d from "./assets/c-hero-classes/9r/9r_d.pdf";
import classhr_a from "./assets/c-hero-classes/hr/hr_a.pdf";
import classhr_b from "./assets/c-hero-classes/hr/hr_b.pdf";
import classhr_c from "./assets/c-hero-classes/hr/hr_c.pdf";
import classhr_d from "./assets/c-hero-classes/hr/hr_d.pdf";
import classrk_a from "./assets/c-hero-classes/rk/rk_a.pdf";
import classrk_b from "./assets/c-hero-classes/rk/rk_b.pdf";
import classrk_c from "./assets/c-hero-classes/rk/rk_c.pdf";
import classrk_d from "./assets/c-hero-classes/rk/rk_d.pdf";
import classrs_a from "./assets/c-hero-classes/rs/rs_a.pdf";
import classrs_b from "./assets/c-hero-classes/rs/rs_b.pdf";
import classrs_c from "./assets/c-hero-classes/rs/rs_c.pdf";
import classrs_d from "./assets/c-hero-classes/rs/rs_d.pdf";
import safetyPDF from "./assets/c-hero-classes/safety/z_safety.pdf";
import troubleshootingPDF from "./assets/c-hero-classes/troubleshooting/troubleshooting.pdf";
import MobDrillLog from "./assets/MOBDrillLog.pdf";
import MobInspectionCheckList from "./assets/MOBInspectionCheckList.pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

let pdfMap = {
  "3b_a": class3b_a,
  "3b_b": class3b_b,
  "3b_c": class3b_c,
  "3b_d": class3b_d,
  "3f_a": class3f_a,
  "3f_b": class3f_b,
  "3f_c": class3f_c,
  "3f_d": class3f_d,
  "5b_a": class5b_a,
  "5b_b": class5b_b,
  "5b_c": class5b_c,
  "5b_d": class5b_d,
  "5f_a": class5f_a,
  "5f_b": class5f_b,
  "5f_c": class5f_c,
  "5f_d": class5f_d,
  "7b_a": class7b_a,
  "7b_b": class7b_b,
  "7b_c": class7b_c,
  "7b_d": class7b_d,
  "7f_a": class7f_a,
  "7f_b": class7f_b,
  "7f_c": class7f_c,
  "7f_d": class7f_d,
  "9r_a": class9r_a,
  "9r_b": class9r_b,
  "9r_c": class9r_c,
  "9r_d": class9r_d,
  hr_a: classhr_a,
  hr_b: classhr_b,
  hr_c: classhr_c,
  hr_d: classhr_d,
  rk_a: classrk_a,
  rk_b: classrk_b,
  rk_c: classrk_c,
  rk_d: classrk_d,
  rs_a: classrs_a,
  rs_b: classrs_b,
  rs_c: classrs_c,
  rs_d: classrs_d,
  safety: safetyPDF,
  troubleshooting: troubleshootingPDF,
  MobDrillLog: MobDrillLog,
  MobInspectionCheckList: MobInspectionCheckList,
};

const PDFRenderPage = () => {
  const [numPages, setNumpages] = useState(1);
  const [panelWidth, setPanelWidth] = useState(500);

  let { classId, safety } = useParams();

  const pdfKey = classId ? classId : safety;

  const onPDFSuccess = ({ numPages }) => {
    setNumpages(numPages);
  };

  useEffect(() => {
    setPanelWidth(document.getElementById("mainPanel").offsetWidth);
  }, []);

  return (
    <div id="mainPanel" className="pb-8">
      <Document
        file={pdfMap[pdfKey]}
        onLoadSuccess={onPDFSuccess}
        onLoadError={console.error}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <div key={index}>
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderAnnotationLayer={true}
              onRenderAnnotationLayerSuccess={console.log}
              onRenderAnnotationLayerError={console.error}
              onGetAnnotationsError={console.error}
              width={panelWidth}
              maxWidth={1000}
            />
          </div>
        ))}
      </Document>
      {classId ? (
        <div className="m-10">
          <Link
            to={`/test/${classId}`}
            className="bg-orange-300 hover:bg-orange-500 hover:text-slate-050 text-2xl text-slate-950 font-bold py-2 px-2 rounded"
          >
            Take the test
          </Link>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

PDFRenderPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      classId: PropTypes.string,
      safety: PropTypes.string,
    }),
  }),
};

export default PDFRenderPage;
