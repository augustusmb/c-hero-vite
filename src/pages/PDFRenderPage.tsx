import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { pdfjs, Document, Page } from "react-pdf";
import BeatLoader from "react-spinners/BeatLoader";
import { ClipboardCheck, ChevronRight, AlertTriangle } from "lucide-react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useLoggedInUserContext } from "../hooks/useLoggedInUserContext";
import { useQuery } from "@tanstack/react-query";
import {
  getFullUserProductProgressMap,
  hasDavitProduct,
} from "../features/user/utils.ts";
import { QueryKeys } from "../lib/QueryKeys.ts";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDF_BASE_URL = import.meta.env.VITE_PDF_BASE_URL ?? "";

const SPECIAL_PDF_PATHS: Record<string, string> = {
  safety: "safety/z_safety.pdf",
  troubleshooting: "troubleshooting/troubleshooting.pdf",
  MobDrillLog: "reference/MOBDrillLog.pdf",
  MobInspectionCheckList: "reference/MOBInspectionCheckList.pdf",
};

const buildPdfUrl = (key: string | undefined): string | null => {
  if (!key || !PDF_BASE_URL) return null;
  const special = SPECIAL_PDF_PATHS[key];
  if (special) return `${PDF_BASE_URL}/${special}`;
  const folder = key.split("_")[0];
  if (!folder) return null;
  return `${PDF_BASE_URL}/${folder}/${key}.pdf`;
};

const PDFRenderPage = () => {
  const { loggedInUserInfo } = useLoggedInUserContext();

  const [numPages, setNumpages] = useState<number | null>(1);
  const [panelWidth, setPanelWidth] = useState(0);
  const [isPdfLoaded, setIsPdfLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const mainPanelRef = useRef<HTMLDivElement>(null);

  const { classId, docId } = useParams();

  const needsDavitCheck = classId === "vr_b";

  const { data: userProductsMap } = useQuery({
    queryKey: [QueryKeys.GET_USER_PRODUCTS_MAP, loggedInUserInfo?.id || 0],
    queryFn: getFullUserProductProgressMap,
    enabled: !!loggedInUserInfo?.id && needsDavitCheck,
  });

  const resolvePdfKey = () => {
    if (
      classId === "vr_b" &&
      userProductsMap &&
      !hasDavitProduct(userProductsMap)
    ) {
      return "vr_b_p";
    }
    return classId || docId;
  };

  const pdfKey = resolvePdfKey();
  const pdfUrl = buildPdfUrl(pdfKey);

  const onPDFSuccess = ({ numPages }: { numPages: number }) => {
    setNumpages(numPages);
    setIsPdfLoaded(true);
    setLoadError(false);
  };

  const onPDFError = (error: Error) => {
    console.error(error);
    setLoadError(true);
  };

  const handleRetry = () => {
    setLoadError(false);
    setIsPdfLoaded(false);
    setRetryKey((k) => k + 1);
  };

  useEffect(() => {
    setIsPdfLoaded(false);
    setLoadError(false);
  }, [pdfKey]);

  useEffect(() => {
    const el = mainPanelRef.current;
    if (!el) return;
    setPanelWidth(el.offsetWidth);
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setPanelWidth(width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!pdfUrl) {
    return (
      <div ref={mainPanelRef} className="pb-8">
        <ErrorPanel message="PDF not found." />
      </div>
    );
  }

  return (
    <div id="mainPanel" ref={mainPanelRef} className="pb-8">
      {loadError ? (
        <ErrorPanel
          message="We couldn't load this PDF. Check your connection and try again."
          onRetry={handleRetry}
        />
      ) : (
        <Document
          key={retryKey}
          file={pdfUrl}
          onLoadSuccess={onPDFSuccess}
          onLoadError={onPDFError}
          externalLinkTarget="_blank"
          externalLinkRel="noopener noreferrer"
          loading={
            <div className="flex justify-center py-20">
              <BeatLoader color="#123abc" loading={true} size={15} />
            </div>
          }
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
      )}
      {classId && isPdfLoaded && !loadError ? (
        <div className="mt-8 flex justify-center border-t border-slate-200 pt-6">
          <Link
            to={`/assessment/${classId}`}
            className="group inline-flex items-center gap-2 rounded-md bg-orange-500 px-5 py-2.5 text-base font-semibold text-slate-050 shadow-sm transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
          >
            <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
            Take the assessment
            <ChevronRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      ) : null}
    </div>
  );
};

const ErrorPanel = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) => (
  <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-3 rounded-lg border border-slate-200 bg-slate-050 p-6 text-center shadow-sm">
    <AlertTriangle className="h-8 w-8 text-orange-500" aria-hidden="true" />
    <p className="text-sm text-slate-700 lg:text-base">{message}</p>
    {onRetry ? (
      <button
        onClick={onRetry}
        className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-slate-050 shadow-sm transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
      >
        Retry
      </button>
    ) : null}
  </div>
);

export default PDFRenderPage;
