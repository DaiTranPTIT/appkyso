import ErrorInfo from "@/components/ErrorInfo";
import { getSignInfoApi } from "@/services/GiaoDienKy/api";
import { ETypeKy } from "@/services/GiaoDienKy/constant";
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
        setTimeout(() => {
            getSignInfo(id);
        }, 500);
    }, []);

    const getSignInfo = async (id: string) => {
        try {
            const res: any = await getSignInfoApi(id);
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
                case ETypeKy.vgca_sim_token:
                    history.push({
                        pathname: `/sim/${id}`,
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