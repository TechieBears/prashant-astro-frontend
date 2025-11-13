import { useEffect, useRef } from 'react';
import ZoomMtgEmbedded from '@zoomus/websdk/embedded';

const ZoomSDKEmbed = ({ meetingId, password, userName }) => {
    const meetingSDKElement = useRef();

    useEffect(() => {
        const client = ZoomMtgEmbedded.createClient();

        let meetingSDKElement = document.getElementById('meetingSDKElement');

        client.init({
            debug: true,
            zoomAppRoot: meetingSDKElement,
            language: 'en-US',
            customize: {
                meetingInfo: ['topic', 'host', 'mn', 'pwd', 'telPwd', 'invite', 'participant', 'dc', 'enctype'],
                toolbar: {
                    buttons: [
                        {
                            text: 'Custom Button',
                            className: 'CustomButton',
                            onClick: () => {
                                console.log('custom button');
                            }
                        }
                    ]
                }
            }
        });

        client.join({
            sdkKey: process.env.REACT_APP_ZOOM_SDK_KEY || 'your-sdk-key',
            signature: '', // You'll need to generate this on your backend
            meetingNumber: meetingId,
            password: password,
            userName: userName,
            userEmail: '',
            tk: '',
            zak: ''
        });

        return () => {
            client.leave();
        };
    }, [meetingId, password, userName]);

    return (
        <div className="h-screen w-full">
            <div id="meetingSDKElement" ref={meetingSDKElement} className="w-full h-full"></div>
        </div>
    );
};

export default ZoomSDKEmbed;