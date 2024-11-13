import { useEffect} from "react";
import { CodeData } from "../../interface";
import { SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";
import "./Iframe.scss";

interface IframeProps {
  code: React.MutableRefObject<CodeData>;
  codeTrigger: boolean;
}

export function Iframe(props: IframeProps) {
  const safeMode = false;

  const { code, codeTrigger } = props;
  const iFrame = document.querySelector(".iframe") as HTMLIFrameElement;

  useEffect(() => {
    // iFrame.srcdoc = code.code
    if (iFrame && iFrame.contentWindow) {
      iFrame.style.opacity = "0"; // Hide iframe during update
      const iframeDocument =
        iFrame.contentDocument || iFrame.contentWindow.document;

      iframeDocument.open();
      iframeDocument.write(code.current.code);
      iframeDocument.close();

      // Fade the iframe back in after the update
      iFrame.style.opacity = "1";
    }
  }, [codeTrigger, iFrame]);


  if (safeMode) {
    return (
      <SandpackProvider
        template="static"
        files={{ "/index.html": code.current.code }}
        options={{
            recompileMode: "immediate",
            recompileDelay: 0,
          }}
      >
        <SandpackPreview
          style={{ height: "100vh", border: "1px solid purple"}}
          showNavigator={false}
          showRefreshButton={false}
        />
      </SandpackProvider>
    );
  }

  return (
    <>
      <iframe
        className="iframe"
        title="Code Output"
        sandbox="allow-same-origin allow-scripts"
      />
    </>
  );
}
