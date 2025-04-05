import {SignFileCallBack1} from './assets/execute';
import { useLocation } from "react-router-dom";
import { useEffect } from 'react';

export default () => {
    const location = useLocation<any>();

    useEffect(() => {
        const signInfo = location.query;
        if(!signInfo) return;
        getSignInfo(signInfo);
    }, [])
    

    const getSignInfo = async(signInfo: any) => { 
        console.log(signInfo);
        try {
            await sign({
                FileName: signInfo.file_link,
                FileUploadHandler: signInfo.callback_url,
                JWTToken: signInfo.jwt_token,
                SessionId: signInfo.session_id,
                MetaData: signInfo.meta_data
            }, signInfo.function);
        } catch(err) {
            console.log(err);
        }
    }

    const sign = async(
        params: {
            FileName: string,
            FileUploadHandler: string,
            SessionId?: string,
            JWTToken?: string,
            DocNumber?: string,
            IssuedDate?: string,
            MetaData: any
        }, functionName?: string
    ) => {
        var json_prms = JSON.stringify(params);
        // @ts-ignore
        if(functionName === 'vgca_sign_approved') await vgca_sign_approved(json_prms, SignFileCallBack1);
        // @ts-ignore
       else if (functionName === 'vgca_sign_issued') await vgca_sign_issued(json_prms, SignFileCallBack1);
        // @ts-ignore
       else if (functionName === 'vgca_sign_income') await vgca_sign_income(json_prms, SignFileCallBack1);
        // @ts-ignore
       else if (functionName === 'vgca_comment') await vgca_comment(json_prms, SignFileCallBack1);
        // @ts-ignore
       else if (functionName === 'vgca_sign_appendix') await vgca_sign_appendix(json_prms, SignFileCallBack1);
        // @ts-ignore
       else if (functionName === 'vgca_sign_copy') await vgca_sign_copy(json_prms, SignFileCallBack1);
        // @ts-ignore
       else if (functionName === 'vgca_sign_files') await vgca_sign_files(json_prms, SignFileCallBack1);
    }

    return <>
        <div className='full-height' style={{backgroundImage: 'url("/chu-ky-so-la-gi.webp")', height: '100%', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}></div>
    </>;
}