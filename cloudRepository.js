"use strict";

var aws = require('aws-sdk');
var doc = require('dynamodb-doc');
var config = require('../../config');

aws.config.region = config.awsRegion;
var docClient = new doc.DynamoDB();

module.exports.CloudRepository = function CloudRepository(tableName, hashKey, rangeKey) {
    function findByIdAndRangeKeyFromDynamoDb(id, range, callback) {
        var params = {
            TableName: tableName,
            Key: {}
        };
        params.Key[hashKey] = id;
        params.Key[rangeKey] = range;
        this.docClient.getItem(params, function (err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null, result.Item);
            }
        });
    }
    function findByIdFromDynamoDb(id, callback) {
        var params = {
            TableName: tableName,
            Key: {}
        };
        params.Key[hashKey] = id;
        this.docClient.getItem(params, function (err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null, result.Item);
            }
        });
    }
    function addOrReplaceToDynamoDb(item, callback) {
        var params = {
            TableName: tableName,
            Item: item
        };
        this.docClient.putItem(params, callback);
    }
    function removeByIdFromDynamoDb(id, callback) {
        var params = {
            TableName: tableName,
            Key: {}
        };
        params.Key[hashKey] = id;
        this.docClient.deleteItem(params, function (err) {
            if (err) {
                callback(err);
            } else {
                callback();
            }
        })
    }
    function removeByIdAndRangeKeyFromDynamoDb(id, range, callback) {
        var params = {
            TableName: tableName,
            Key: {}
        };
        params.Key[hashKey] = id;
        params.Key[rangeKey] = range;
        this.docClient.deleteItem(params, function (err) {
            if (err) {
                callback(err);
            } else {
                callback();
            }
        })
    }
    function findBy(arg1, arg2, arg3) {
        if (typeof(arg2) === 'function') {
            findByIdFromDynamoDb(arg1, arg2);
        } else {
            findByIdAndRangeKeyFromDynamoDb(arg1, arg2, arg3);
        }
    }
    function removeBy(arg1, arg2, arg3) {
        if (typeof(arg2) === 'function') {
            removeByIdFromDynamoDb(arg1, arg2);
        } else {
            removeByIdAndRangeKeyFromDynamoDb(arg1, arg2, arg3);
        }
    }
    return {
        docClient: docClient,
        findBy: findBy,
        addOrReplace: addOrReplaceToDynamoDb,
        removeBy: removeBy
    };
};