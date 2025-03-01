import { useEffect } from 'react';
import {SignFileCallBack1} from './assets/execute';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { apiGateway } from '@/utils/ip';

export default () => {
    const { id } = useParams();
    useEffect(() => {   
        if(id) {
            getSignInfo(id);
        } 
    }, []);

    const getSignInfo = async(id: string) => {
        try {
            const res: any = await axios.get(`${apiGateway}/api/v1/sign-info/${id}`);
            await sign({
                FileName: res.data.file_link,
                FileUploadHandler: res.data.file_upload_handler,
                JWTToken: "",
                SessionId: res.data.session_id,
                MetaData: res.data.meta_data
            });
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
        }
    ) => {
        var json_prms = JSON.stringify(params);
        // @ts-ignore
        await vgca_sign_approved(json_prms, SignFileCallBack1);
    }

    return <>
        <div className='full-height' style={{backgroundImage: 'url("/chu-ky-so-la-gi.webp")', height: '100%', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}></div>
    </>;
}