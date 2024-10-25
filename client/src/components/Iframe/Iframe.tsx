import { useEffect } from "react";
import { CodeData } from "../../interface"
import "./Iframe.scss"

interface IframeProps {
    code: CodeData
}

export function Iframe(props:IframeProps){

    const { code } = props
    const iFrame = document.querySelector('.iframe') as HTMLIFrameElement

    useEffect(() => {

        // iFrame.srcdoc = code.code
        if (iFrame && iFrame.contentWindow) {

            iFrame.style.opacity = "0"; // Hide iframe during update
            const iframeDocument = iFrame.contentDocument || iFrame.contentWindow.document;

            iframeDocument.open();
            iframeDocument.write(code.code);
            iframeDocument.close();

            // Fade the iframe back in after the update
            iFrame.style.opacity = "1";
        }
    }, [code, iFrame])

    return (
        <iframe className="iframe" title="Code Output" />
    )
    
}