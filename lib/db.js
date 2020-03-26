var MongoClient = require('mongodb').MongoClient;
var urlDB = "mongodb://localhost:27017/";

function CreateRequestCUBE(SessionID, RequestID, ObjectID) {

    MongoClient.connect(urlDB, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;

        var date = new Date();

        var dbo = db.db("notifications");
        var myobj = {   sessionid: SessionID, 
                        requestid: RequestID,
                        requestdate: date,
                        objectid: ObjectID,
                        url: '',
                        explanation: '',
                        answer: "no"
                    };

        dbo.collection("notifications").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("Document inserted");
            db.close();
        });
    });

};

function UpdateDataCUBE(RequestID, url, explanation){
    console.log(RequestID);
    MongoClient.connect(urlDB, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        
        var dbo = db.db("notifications");
        
        var myquery = { requestid: RequestID };
        
        var newvalues = { $set: {url: url, explanation: explanation, answer: "yes" } };
        dbo.collection("notifications").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            db.close();
        });
    });
};

function DeleteByRequestID(RequestID){
    MongoClient.connect(urlDB, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("notifications");
        var myquery = { requestid: RequestID };
        dbo.collection("notifications").deleteMany(myquery, function(err, obj) {
            if (err) throw err;
            console.log(obj.result.n + " document(s) deleted");
            db.close();
        });
    });
};

function DeleteBySessionID(SessionID){
    MongoClient.connect(urlDB, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("notifications");
        var myquery = { sessionid: SessionID };
        dbo.collection("notifications").deleteMany(myquery, function(err, obj) {
            if (err) throw err;
            console.log(obj.result.n + " document(s) deleted");
            db.close();
        });
    });
};

function GetOpenRequests(){
    return new Promise(function(resolve, reject){
        MongoClient.connect(urlDB, { useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db("notifications");
            var myquery = { answer: "no" };
            dbo.collection("notifications").find(myquery, { projection: { _id: 0, sessionid: 1, requestid: 1 } }).toArray(function(err, result) {
                if (err) throw err;
                resolve(result);
                db.close();
            });
        });
    });
};

module.exports.CreateRequestCUBE = CreateRequestCUBE;
module.exports.UpdateDataCUBE = UpdateDataCUBE;
module.exports.DeleteByRequestID = DeleteByRequestID;
module.exports.DeleteBySessionID = DeleteBySessionID;
module.exports.GetOpenRequests = GetOpenRequests;