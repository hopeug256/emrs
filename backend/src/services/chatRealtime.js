const { WebSocketServer, WebSocket } = require("ws");
const jwt = require("jsonwebtoken");

let wsServer = null;
const socketsByUser = new Map();

function getSecret() {
  return process.env.JWT_SECRET || "dev-secret";
}

function parseTokenFromReq(req) {
  try {
    const url = new URL(req.url, "http://localhost");
    return url.searchParams.get("token");
  } catch {
    return null;
  }
}

function addSocket(userId, socket) {
  const key = String(userId);
  const set = socketsByUser.get(key) || new Set();
  set.add(socket);
  socketsByUser.set(key, set);
}

function removeSocket(userId, socket) {
  const key = String(userId);
  const set = socketsByUser.get(key);
  if (!set) return;
  set.delete(socket);
  if (!set.size) socketsByUser.delete(key);
}

function sendJson(socket, payload) {
  if (socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify(payload));
}

function initChatWebSocketServer(httpServer) {
  if (wsServer) return wsServer;
  wsServer = new WebSocketServer({ noServer: true });

  httpServer.on("upgrade", (req, socket, head) => {
    if (!String(req.url || "").startsWith("/ws/chat")) return;
    const token = parseTokenFromReq(req);
    if (!token) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }
    let payload;
    try {
      payload = jwt.verify(token, getSecret());
    } catch {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    wsServer.handleUpgrade(req, socket, head, (ws) => {
      ws.userId = payload.sub;
      addSocket(ws.userId, ws);
      sendJson(ws, { type: "chat.connected", userId: ws.userId });

      ws.on("close", () => {
        removeSocket(ws.userId, ws);
      });
    });
  });

  return wsServer;
}

function publishChatMessage(userIds, payload) {
  const unique = [...new Set((userIds || []).map((id) => String(id)))];
  unique.forEach((userId) => {
    const sockets = socketsByUser.get(userId);
    if (!sockets) return;
    sockets.forEach((socket) => sendJson(socket, payload));
  });
}

module.exports = {
  initChatWebSocketServer,
  publishChatMessage
};
