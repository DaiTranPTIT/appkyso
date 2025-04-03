export interface IProps {
    errMessage?: string
}

export default (props: IProps) => {
    const {errMessage} = props;
    return <>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
            <img src="/error.webp" width={200}/>
            <strong>{errMessage? errMessage: 'Có lỗi xảy ra!'}</strong>
        </div>
    </>
}