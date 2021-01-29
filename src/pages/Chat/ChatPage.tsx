import {Avatar, Button, Col, Row} from "antd";
import React, {useEffect, useRef, useState} from "react";
import {FC} from "react";
import TextArea from "antd/es/input/TextArea";
import Preloader from "../../common/prelooader/Preloader";
import {useDispatch, useSelector} from "react-redux";
import {sendMessage, startMessagesListening, stopMessagesListening} from "../../redux/chat_reducer";
import {AppStateType} from "../../redux/redux_store";


export type MessageType = {
    message: string
    photo: string
    userId: number
    userName: string
}


export const ChatPage: FC = () => {


    return <div>
        <Chat/>
    </div>
}

const Chat = () => {
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(startMessagesListening())

        return () => {
            dispatch(stopMessagesListening())
        }
    }, [])



    return <div>
        <Row>
            <Col span={18} push={6}>

            </Col>
            <Col span={6} pull={18}>
                <Messages />
            </Col>
        </Row>
        <Row>
            <AddNewMessageForm />
        </Row>


    </div>
}

const Messages: FC = () => {
    const messagesEndRef = useRef(null)
    const messages = useSelector((state: AppStateType) => state.chat.messages)
    const scrollToBottom = () => {
        // @ts-ignore
        messagesEndRef.current.scrollIntoView({behavior: "smooth"})
    }

    useEffect(scrollToBottom, [messages]);




    if (messages === [])
        return <Preloader/>
    else
        return <div style={{height: 400, overflowY: "auto", width: 500}}>
            {messages.map((n: MessageType, index) => <Message key={index} message={n}/>)}
            <div ref={messagesEndRef}/>
        </div>
}

const Message: FC<{ message: MessageType }> = ({message}) => {

    return <div>
        <Avatar src={message.photo}/>
        <span style={{color: "cornflowerblue", marginLeft: 5, marginBottom: 7}}>{message.userName}</span>
        <p style={{marginLeft: 20}}>{message.message}</p>
    </div>
}

const AddNewMessageForm: FC = () => {
    const [message, setMessage] = useState('')
    const [readyStatus, setReadyStatus] = useState<'pending' | 'ready'>('pending')

    const dispatch = useDispatch()

    const sendMessageHandler = () => {
        if (!message)
            return;

        dispatch(sendMessage(message))
        setMessage('')
    }
    return <div>
        <TextArea onChange={(e) => setMessage(e.currentTarget.value)} value={message} style={{resize: 'none'}}/>
        <Button disabled={false} onClick={sendMessageHandler} type={'primary'}>Send</Button>
    </div>
}