const kafka = require('kafka-node');
const messageModel = require('../models/messageModel');
const logger = require('../helpers/loghelper');

const client = new kafka.KafkaClient({ kafkaHost: 'localhost:8000' });

const consumer = new kafka.Consumer(
    client,
    [
        { topic: 'chatTopic' }
    ],
    {
        autoCommit: false,
        encoding: 'utf8',
        keyEncoding: 'utf8'
    }
);

module.exports = consumer;




