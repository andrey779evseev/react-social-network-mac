import {BaseThunkType, InferActionsType} from "./redux_store";
import {MessageType} from "../pages/Chat/ChatPage";
import {chatApi} from "../api/chat-api";
import {Dispatch} from "redux";

let initialState = {
    messages: [] as MessageType[]
}
export type initialStateType = typeof initialState
type ActionsType = InferActionsType<typeof actions>
type ThunkType = BaseThunkType<ActionsType>

const chatReducer = (state = initialState, action: ActionsType): initialStateType  => {

    switch (action.type) {
        case 'MESSAGES_RECEIVED':
            return {
                ...state,
                messages: [...state.messages, ...action.payload]
            }
        default:
            return state;
    }
}

const actions = {
    messagesReceived: (messages: MessageType[]) => ({type: 'MESSAGES_RECEIVED', payload: messages} as const)
}

let _newMessageHandler: ((messages: MessageType[]) => void) | null = null

const newMessageHandlerCreator = (dispatch: Dispatch) => {
    if (_newMessageHandler === null){
        _newMessageHandler = (messages : MessageType[]) => {
            dispatch(actions.messagesReceived(messages))
        }
    }

    return _newMessageHandler
}

export const startMessagesListening = ():ThunkType => async (dispatch) => {
    chatApi.start()
    chatApi.subscribe(newMessageHandlerCreator(dispatch))
}

export const stopMessagesListening = ():ThunkType => async (dispatch) => {
    chatApi.unsubscribe(newMessageHandlerCreator(dispatch))
    chatApi.stop()
}
export const sendMessage = (message: string):ThunkType => async (dispatch) => {
    chatApi.sendMessage(message)
}

export default chatReducer