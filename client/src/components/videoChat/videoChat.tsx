
interface VideoChatProps {
    localVideoRef: React.LegacyRef<HTMLVideoElement>,
    remoteVideoRef: React.LegacyRef<HTMLVideoElement>
}

export function VideoChat(props: VideoChatProps){

    const {localVideoRef, remoteVideoRef } = props

    return (
        <div className="peerchat">
            <video className="peerchat__video" ref={localVideoRef} autoPlay playsInline muted style={{ width: '200px', height: 'auto', border: '1px solid black' }} />
            <video className="peerchat__video" ref={remoteVideoRef} autoPlay playsInline style={{ width: '200px', height: 'auto', border: '1px solid black' }} />
        </div>
    );
}