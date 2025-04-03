function SignFileCallBack1(rv) {
    var received_msg = JSON.parse(rv);
    window.close();
}
export {
    SignFileCallBack1
}