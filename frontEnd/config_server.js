class server{
    static api(){
        let hostname = window.location.hostname;
        let port = window.location.port;
        if(hostname==='localhost' && port==='2222'){
            return `http://${hostname}:${5000}/api/`;
        }else if(hostname==='127.0.0.1' && port==='2222'){
            return `http://${hostname}:${5000}/api/`;
        }else{
            return "http://localhost:5000/api/";
        }
    }
 }
