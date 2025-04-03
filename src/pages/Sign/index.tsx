import ErrorBoundary from "@/components/ErrorBoundary";
import ErrorInfo from "@/components/ErrorInfo";
import { ETypeKy } from "@/services/GiaoDienKy/constant";
import { ISignInfo } from "@/services/GiaoDienKy/typing";
import { apiGateway } from "@/utils/ip";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { history } from 'umi';

type ParamsType = {
    id: string;
};

export default () => {
    const { id } = useParams<ParamsType>();
    const [isError, setIsError] = useState<boolean>();

    useEffect(() => {
        getSignInfo(id);
    }, []);

    const getSignInfo = async (id: string) => {
        try {
            const res: any = await axios.get(`${apiGateway}/api/v1/sign-info/${id}`);
            if (!res.data) return;
            const signInfo: any = res.data;
            switch (signInfo.type) {
                case ETypeKy.vgca_usb_token: 
                    history.push({
                        pathname: '/usbtoken',
                        query: signInfo,
                    });
                    break;
                case ETypeKy.vgca_remote_token:
                    history.push({
                        pathname: `/remote-signing/${id}`,
                        query: signInfo,
                    });
                    break;
            }
        } catch (err) {
            setIsError(true);
        }
    }


    return <>
        {
            isError && <ErrorInfo errMessage="Không thể lấy được thông tin chữ ký!"/>
        }
    </>
}