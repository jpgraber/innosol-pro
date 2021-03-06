const sockEvents = require('../sock-events');
const sockStore  = require('../sock-store');
const authToken  = require("../../common/auth-token");
const async      = require('async');
const user       = require('../../models/user.model');

const onJoinRoom = (data) => {
  const tokenString = data.payload;
  const socket = data.socket;
  
  console.log('we are attempting to join this room');

  if (!tokenString || !socket) { return; }
  authToken.verifyTokenAndReturnUser(tokenString, function(err, userModel) {
    if (!userModel || !userModel.isAdmin) { return; }

    console.log('we have been authenticated');

    sockStore.joinRoom('admin', userModel);
    const connectedSockets = sockStore.getConnectedClientList();
    
    const users = user.find({_id: {$in: connectedSockets}}, function(err, users) {
      if (err) { return; }
      const payload = {
        event: sockEvents.e.notifyRoom,
        room: 'admin',
        data: {
          connectedClients: users.map(cur => cur.clientProps)
        } 
      };
      socket.write(JSON.stringify(payload));    
    });
  });
}

const config = () => {
  sockEvents.attachEventListener(sockEvents.e.joinRoom, onJoinRoom);
}

module.exports = {
  config
};