import { useEffect, useState } from "react";
import { CodeData } from "../../interface";
import { SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";
import "./Iframe.scss";

interface IframeProps {
  code: React.MutableRefObject<CodeData>;
  codeTrigger: boolean;
}

export function Iframe(props: IframeProps) {
  const safeMode = true;
  const { code } = props;
  
  // Only use state for initial loading
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Mark as initialized after first render
    if (!isInitialized && code.current.code) {
      setIsInitialized(true);
    }
  }, [code.current.code, isInitialized]);

  if (safeMode) {
    // Don't render until we have initial code
    if (!isInitialized && !code.current.code) {
      return null;
    }

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
          style={{ height: "100vh", border: "1px solid purple" }}
          showNavigator={false}
          showRefreshButton={true}
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