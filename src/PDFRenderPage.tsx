import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import class_3b_a from "./assets/c-hero-classes/3b/3b_a.pdf";
import class_3b_b from "./assets/c-hero-classes/3b/3b_b.pdf";
import class_3b_c from "./assets/c-hero-classes/3b/3b_c.pdf";
import class_3b_d from "./assets/c-hero-classes/3b/3b_d.pdf";
import class_3f_a from "./assets/c-hero-classes/3f/3f_a.pdf";
import class_3f_b from "./assets/c-hero-classes/3f/3f_b.pdf";
import class_3f_c from "./assets/c-hero-classes/3f/3f_c.pdf";
import class_3f_d from "./assets/c-hero-classes/3f/3f_d.pdf";
import class_5b_a from "./assets/c-hero-classes/5b/5b_a.pdf";
import class_5b_b from "./assets/c-hero-classes/5b/5b_b.pdf";
import class_5b_c from "./assets/c-hero-classes/5b/5b_c.pdf";
import class_5b_d from "./assets/c-hero-classes/5b/5b_d.pdf";
import class_5f_a from "./assets/c-hero-classes/5f/5f_a.pdf";
import class_5f_b from "./assets/c-hero-classes/5f/5f_b.pdf";
import class_5f_c from "./assets/c-hero-classes/5f/5f_c.pdf";
import class_5f_d from "./assets/c-hero-classes/5f/5f_d.pdf";
import class_7b_a from "./assets/c-hero-classes/7b/7b_a.pdf";
import class_7b_b from "./assets/c-hero-classes/7b/7b_b.pdf";
import class_7b_c from "./assets/c-hero-classes/7b/7b_c.pdf";
import class_7b_d from "./assets/c-hero-classes/7b/7b_d.pdf";
import class_7f_a from "./assets/c-hero-classes/7f/7f_a.pdf";
import class_7f_b from "./assets/c-hero-classes/7f/7f_b.pdf";
import class_7f_c from "./assets/c-hero-classes/7f/7f_c.pdf";
import class_7f_d from "./assets/c-hero-classes/7f/7f_d.pdf";
import class_9f_a from "./assets/c-hero-classes/9f/9f_a.pdf";
import class_9f_b from "./assets/c-hero-classes/9f/9f_b.pdf";
import class_9f_c from "./assets/c-hero-classes/9f/9f_c.pdf";
import class_9f_d from "./assets/c-hero-classes/9f/9f_d.pdf";
import class_hr_a from "./assets/c-hero-classes/hr/hr_a.pdf";
import class_hr_b from "./assets/c-hero-classes/hr/hr_b.pdf";
import class_hr_c from "./assets/c-hero-classes/hr/hr_c.pdf";
import class_hr_d from "./assets/c-hero-classes/hr/hr_d.pdf";
import class_rk_a from "./assets/c-hero-classes/rk/rk_a.pdf";
import class_rk_b from "./assets/c-hero-classes/rk/rk_b.pdf";
import class_rk_c from "./assets/c-hero-classes/rk/rk_c.pdf";
import class_rk_d from "./assets/c-hero-classes/rk/rk_d.pdf";
import class_rs_a from "./assets/c-hero-classes/rs/rs_a.pdf";
import class_rs_b from "./assets/c-hero-classes/rs/rs_b.pdf";
import class_rs_c from "./assets/c-hero-classes/rs/rs_c.pdf";
import class_rs_d from "./assets/c-hero-classes/rs/rs_d.pdf";
import class_vr_a from "./assets/c-hero-classes/vr/vr_a.pdf";
import class_vr_b from "./assets/c-hero-classes/vr/vr_b.pdf";
import class_vr_b_p from "./assets/c-hero-classes/vr/vr_b_p.pdf";
import class_vr_c from "./assets/c-hero-classes/vr/vr_c.pdf";
import class_vr_d from "./assets/c-hero-classes/vr/vr_d.pdf";
import class_vr_p from "./assets/c-hero-classes/vr/vr_p.pdf";
import safetyPDF from "./assets/c-hero-classes/safety/z_safety.pdf";
import troubleshootingPDF from "./assets/c-hero-classes/troubleshooting/troubleshooting.pdf";
import MobDrillLog from "./assets/MOBDrillLog.pdf";
import MobInspectionCheckList from "./assets/MOBInspectionCheckList.pdf";
import { useLoggedInUserContext } from "./hooks/useLoggedInUserContext";
import { useQuery } from "@tanstack/react-query";
import {
  getFullUserProductProgressMap,
  hasDavitProduct,
} from "./utils/user.ts";
import { QueryKeys } from "./utils/QueryKeys.ts";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

let pdfMap = {
  "3b_a": class_3b_a,
  "3b_b": class_3b_b,
  "3b_c": class_3b_c,
  "3b_d": class_3b_d,
  "3f_a": class_3f_a,
  "3f_b": class_3f_b,
  "3f_c": class_3f_c,
  "3f_d": class_3f_d,
  "5b_a": class_5b_a,
  "5b_b": class_5b_b,
  "5b_c": class_5b_c,
  "5b_d": class_5b_d,
  "5f_a": class_5f_a,
  "5f_b": class_5f_b,
  "5f_c": class_5f_c,
  "5f_d": class_5f_d,
  "7b_a": class_7b_a,
  "7b_b": class_7b_b,
  "7b_c": class_7b_c,
  "7b_d": class_7b_d,
  "7f_a": class_7f_a,
  "7f_b": class_7f_b,
  "7f_c": class_7f_c,
  "7f_d": class_7f_d,
  "9f_a": class_9f_a,
  "9f_b": class_9f_b,
  "9f_c": class_9f_c,
  "9f_d": class_9f_d,
  hr_a: class_hr_a,
  hr_b: class_hr_b,
  hr_c: class_hr_c,
  hr_d: class_hr_d,
  rk_a: class_rk_a,
  rk_b: class_rk_b,
  rk_c: class_rk_c,
  rk_d: class_rk_d,
  rs_a: class_rs_a,
  rs_b: class_rs_b,
  rs_c: class_rs_c,
  rs_d: class_rs_d,
  vr_a: class_vr_a,
  vr_b: class_vr_b,
  vr_b_p: class_vr_b_p,
  vr_c: class_vr_c,
  vr_d: class_vr_d,
  vr_p: class_vr_p,
  safety: safetyPDF,
  troubleshooting: troubleshootingPDF,
  MobDrillLog: MobDrillLog,
  MobInspectionCheckList: MobInspectionCheckList,
};

const PDFRenderPage = () => {
  const { loggedInUserInfo } = useLoggedInUserContext();

  const [numPages, setNumpages] = useState<number | null>(1);
  const [panelWidth, setPanelWidth] = useState(500);

  let { classId, safety } = useParams();

  const { data: userProductsMap } = useQuery({
    queryKey: [QueryKeys.GET_USER_PRODUCTS_MAP, loggedInUserInfo?.id || 0],
    queryFn: getFullUserProductProgressMap,
    enabled: !!loggedInUserInfo?.id,
  });

  const getPdfKey = () => {
    if (
      classId === "vr_b" &&
      userProductsMap &&
      !hasDavitProduct(userProductsMap)
    ) {
      return "vr_b_p"; // Use Prusik-included operation PDF
    }
    return classId || safety;
  };

  const pdfKey = getPdfKey();

  const onPDFSuccess = ({ numPages }: { numPages: number }) => {
    setNumpages(numPages);
  };

  useEffect(() => {
    setPanelWidth(document.getElementById("mainPanel")?.offsetWidth ?? 0);
  }, []);

  return (
    <div id="mainPanel" className="pb-8">
      <Document
        file={pdfMap[pdfKey as keyof typeof pdfMap]}
        onLoadSuccess={onPDFSuccess}
        onLoadError={console.error}
      >
        {Array.from(new Array(numPages), (_el, index) => (
          <div key={index}>
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderAnnotationLayer={true}
              onRenderAnnotationLayerError={console.error}
              onGetAnnotationsError={console.error}
              width={panelWidth}
            />
          </div>
        ))}
      </Document>
      {classId ? (
        <div className="m-10">
          <Link
            to={`/test/${classId}`}
            className="drop-shadow-orange-900 rounded bg-orange-300 px-2 py-2 text-lg font-bold text-slate-950 drop-shadow-2xl hover:bg-orange-500 hover:text-slate-050 lg:text-2xl"
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

export default PDFRenderPage;
