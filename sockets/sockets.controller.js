const { Socket } = require("socket.io");
const validateToken = require("../helpers/validateToken");
const { ChatMessages } = require("../models");

const chatMessages = new ChatMessages()

const socketsController = async ( socket = new Socket, io ) => {
  const user = await validateToken(socket.handshake.headers.authorization);

  if (!user) {
    socket.disconnect();
  }

  // Agregar al usuario conectado
  chatMessages.connectUser(user);
  io.emit("users-active", chatMessages.usersArr);
  socket.emit("receive-message", chatMessages.lastTeenMessages)

  // Conectar a una sala especial
  socket.join( user.id );

  // Eliminar al usuario desconectado
  socket.on("disconnect", () => {
    chatMessages.disconnectUser( user.id );
    io.emit("users-active", chatMessages.usersArr)
  })

  socket.on("send-message", ({ uid, message }) => {
    
    if (uid) {
      // Mensaje privado
      socket.to(uid).emit("private-message", { of: user.name, message })
    } else {
      chatMessages.sendMessage(user.id, user.name, message);
      io.emit("receive-message", chatMessages.lastTeenMessages);
    }

  })

}

module.exports = {
  socketsController,
}