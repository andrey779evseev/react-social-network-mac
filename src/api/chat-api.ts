import {MessageType} from "../pages/Chat/ChatPage";


let subscribers = [] as Array<(messages: MessageType[]) => void>


let ws: WebSocket | null = null


const closeHandler = () => {
    setTimeout(createChannel, 3000)
}

let messageHandler = (e: MessageEvent) => {
    const newMessages = JSON.parse(e.data)
    subscribers.forEach(s => s(newMessages))
};

const createChannel = () => {

    ws?.removeEventListener('close', closeHandler)
    ws?.close()

    ws = new WebSocket("wss://social-network.samuraijs.com/handlers/ChatHandler.ashx")
    ws.addEventListener('close', closeHandler)
    ws.addEventListener('message', messageHandler)
}

export const chatApi = {
    start() {
        createChannel()
    },
    stop() {
        subscribers=[]
        ws?.removeEventListener('close', closeHandler)
        ws?.removeEventListener('message', messageHandler)
        ws?.close()
    },
    subscribe(callback: (messages: MessageType[]) => void) {
        subscribers.push(callback)
        return () => {
            subscribers = subscribers.filter(s => s !== callback)
        }
    },
    unsubscribe(callback: (messages: MessageType[]) => void){
        subscribers = subscribers.filter(s => s !== callback)
    },
    sendMessage (message: string) {
        ws?.send(message)
    }
}