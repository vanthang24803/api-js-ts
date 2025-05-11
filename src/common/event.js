const EventEmitter = require("eventemitter3");

const event = new EventEmitter();

event.on(constant.EVENTS.PING, (data) => {
  log.info(`Pong ${data}`);
});

global.pubsub = event;
