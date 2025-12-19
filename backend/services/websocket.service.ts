import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';

let wss: WebSocketServer;

export const initializeWebSocket = (server: http.Server) => {
    wss = new WebSocketServer({ server, path: '/api/caro/ws' });

    wss.on('connection', (ws: WebSocket) => {
        console.log('💡 WebSocket client connected');

        ws.on('message', (message: string) => {
            console.log(`Received message: ${message}`);
            // TODO: Process message with CARO's LLM service
            // For now, echo back
            ws.send(`Echo: ${message}`);
        });

        ws.on('close', () => {
            console.log('🔌 WebSocket client disconnected');
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    });

    console.log('✅ WebSocket server initialized.');
};

export const broadcast = (data: any) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};



