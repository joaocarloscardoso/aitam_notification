const axios = require('axios');

//logging system
var db = require('./lib/db.js');

//get request through axios component

axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
    .then(response => {
        var SessionId=Math.floor(Date.now() / 1001).toString();
        var RequestId=Math.floor(Date.now() / 1000).toString();
        
        db.CreateRequestCUBE(SessionId, RequestId,'rec20200102');
        //console.log(response.data.url);
        //console.log(response.data.explanation);
    })
    .catch(error => {
        console.log(error);
});
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

db.GetOpenRequests().then(function(Requests){
    for (var i=0; i<Requests.length; i++) {
        CheckData(Requests[i].requestid);
    };
});


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
