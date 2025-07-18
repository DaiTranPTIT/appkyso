function SignFileCallBack1(rv) {
    var received_msg = JSON.parse(rv);
    console.log(received_msg);
    if (received_msg.Status == 0) {
        //console.log(received_msg);
        document.getElementById("_signature").value = received_msg.FileName + ":" + received_msg.FileServer + ":" + received_msg.DocumentNumber + ":" + received_msg.DocumentDate;
        document.getElementById("file1").value = received_msg.FileServer;
        document.getElementById("file2").value = received_msg.FileServer;
    } else {
        document.getElementById("_signature").value = received_msg.Message;
    }
}

function exc_sign_issued() {
    var prms = {};

    prms["FileUploadHandler"] = "http://localhost:8080/FileUploadHandler.aspx";
    prms["SessionId"] = "";//xác thực cookies
    prms["JWTToken"] = "";//xác thực jwt token
    prms["FileName"] = "https://cms.ca.gov.vn/Upload/Test-doc-libre.signed.pdf"; //
    prms["DocNumber"] = "79";
    prms["IssuedDate"] = "";

    var json_prms = JSON.stringify(prms);


    vgca_sign_issued(json_prms, SignFileCallBack1);

}

function exc_sign_approved(url) {
    var prms = {};

    prms["FileUploadHandler"] = "http://localhost:8080/FileUploadHandler.aspx";
    prms["SessionId"] = "";//xác thực cookies
    prms["JWTToken"] = "";//xác thực jwt token
    prms["FileName"] = "";

    var json_prms = JSON.stringify(prms);
    vgca_sign_approved(json_prms, SignFileCallBack1);

}

function exc_sign_income(url) {
    var prms = {};
    var scv = [{ "Key": "abc", "Value": "abc" }];

    prms["FileUploadHandler"] = "http://localhost:8080/FileUploadHandler.aspx";
    prms["SessionId"] = "";//xác thực cookies
    prms["JWTToken"] = "";//xác thực jwt token
    prms["FileName"] = "";
    prms["MetaData"] = scv;

    var json_prms = JSON.stringify(prms);
    vgca_sign_income(json_prms, SignFileCallBack1);
}

function exc_comment(url) {
    var prms = {};
    var scv = [{ "Key": "abc", "Value": "abc" }];

    prms["FileUploadHandler"] = "http://localhost:8080/FileUploadHandler.aspx";
    prms["SessionId"] = "";//xác thực cookies
    prms["JWTToken"] = "";//xác thực jwt token
    prms["FileName"] = url;
    prms["MetaData"] = scv;

    var json_prms = JSON.stringify(prms);
    vgca_comment(json_prms, SignFileCallBack1);
}

function exc_appendix(url) {
    var prms = {};
    var scv = [{ "Key": "abc", "Value": "abc" }];

    prms["FileUploadHandler"] = "http://localhost:8080/FileUploadHandler.aspx";
    prms["SessionId"] = "";//xác thực cookies
    prms["JWTToken"] = "";//xác thực jwt token
    prms["FileName"] = "";
    prms["DocNumber"] = "123/BCY-CTSBMTT";
    prms["MetaData"] = scv;

    var json_prms = JSON.stringify(prms);
    vgca_sign_appendix(json_prms, SignFileCallBack1);
}

function exc_sign_copy(url) {
    var prms = {};
    var scv = [{ "Key": "abc", "Value": "abc" }];

    prms["FileUploadHandler"] = "http://localhost:8080/FileUploadHandler.aspx";
    prms["SessionId"] = "";//xác thực cookies
    prms["JWTToken"] = "";//xác thực jwt token
    prms["FileName"] = "";
    prms["DocNumber"] = "123/BCY-CTSBMTT";
    prms["MetaData"] = scv;

    var json_prms = JSON.stringify(prms);
    vgca_sign_copy(json_prms, SignFileCallBack1);
}

function exc_sign_lylich() {

    //format lại chuỗi JSON
    var txt = document.getElementById("_txtfiles").value;
    var prms = JSON.parse(txt);
    var json_prms = JSON.stringify(prms);

    console.log(json_prms);

    vgca_sign_files(json_prms, SignFileCallBack1);
}

export {
    exc_sign_issued
}