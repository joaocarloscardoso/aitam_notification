const axios = require('axios');

//logging system
var db = require('./lib/db.js');

//data to be sent and/or stored in notification mechanism
var SessionId=Math.floor(Date.now() / 1001).toString();
var ObjectID='rec20200102';
var Subject='Question on recommendation';

function CreateRequest(SessionId, ObjectID, Subject){
    //get request through axios component
    axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
        .then(response => {
        
            //to be obtained by the service response
            var RequestId=Math.floor(Date.now() / 1000).toString();
            
            db.CreateRequestCUBE(SessionId, RequestId, ObjectID, Subject);
            //console.log(response.data.url);
            //console.log(response.data.explanation);
        })
        .catch(error => {
            console.log(error);
    });
};
/*
// multiple concurrent requests with axios
axios.all([
        axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=2020-03-26'),
        axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=2020-03-25')
    ]).then(axios.spread((response1, response2) => {
        console.log(response1.data.url);
        console.log(response2.data.url);
    })).catch(error => {
        console.log(error);
    });
*/
//post request through axios component
/*
axios({
    "method": "POST",
    "url": "http://httpbin.org/post",
    "params": {
        "key": "abc123"
    },
    "data": {
        "firstname": "Nic",
        "lastname": "Raboy"
    }
}).then(response => {
    console.log(response.data);
});
*/

db.DeleteByRequestID('DEMO_KEY');  
db.DeleteBySessionID('1583652701');

function CheckData(requestID){
    axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
    .then(response => {
        if (response.data.url != '' || response.data.explanation !='') {
            db.UpdateDataCUBE(requestID, response.data.url,response.data.explanation)
            //later:create notification for sessionid ;
        }
    })
    .catch(error => {
        console.log(error);
    });
};

function ListenerOpenRequests(){
    db.GetOpenRequests().then(function(Requests){
        for (var i=0; i<Requests.length; i++) {
            CheckData(Requests[i].requestid);
        };
    });
};

//CreateRequest(SessionId, ObjectID, Subject);
ListenerOpenRequests();
