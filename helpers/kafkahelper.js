const kafka = require('kafka-node');
const messageModel = require('../models/messageModel');
const logger = require('../helpers/loghelper');

const client = new kafka.KafkaClient({ kafkaHost: 'localhost:8000' });

const sendMessage = async function (msg, sessionId) {
    const producer = new kafka.Producer(client);
    const message = new messageModel(msg, sessionId, Date.now());
    payloads = [
        { topic: 'chatTopic', messages: JSON.stringify(message) }
    ];
    producer.send(payloads, function (err, data) {
        if (err) {
            logger.error(err);
        }
        logger.info(data);
    });
    producer.on('error', function (err) { });
};

module.exports.sendMessage = sendMessage;