import {useEffect, useState} from "react";
import "./Countdown.scss"
import React from 'react';
import {Alert, Snackbar} from "@mui/material";

export const Countdown=({time,refresh})=> {
    const [timer, setTimer] = useState(time);
    const [timeout,setTimeOut]=useState(false);
    const [open,setOpen]=useState(false)
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimer(prevTimer=>{
                if(prevTimer>0){
                    return prevTimer-1;
                }
                else{
                    setTimeOut(true)
                    return prevTimer-1
                }
            });
        }, 1000);

        // 清除定时器
        return () => clearInterval(intervalId);
    }, []); // 空依赖数组表示只在组件挂载和卸载时执行一次
    useEffect(()=>{
        setTimer(time)
    },[refresh])
    useEffect(()=>{
        if(timeout) {
            setOpen(true)
        }
    },[timeout])
    return (
        <>
            <div className={"countdown"}>
                {!timeout ?
                    <div className={"content"}><img src={"/timer.gif"} alt={"沙漏动图"} className={"timer-gif"}/><span>{timer}s</span></div>
                    :
                    <div className={"content"}><img src={"/timer.gif"} alt={"沙漏动图"} className={"timer-gif"}/><span style={{color:"red",fontWeight:"bolder"}}>{timer}s</span></div>
                }
            </div>
            <Snackbar open={open} autoHideDuration={4000} onClose={()=>{setOpen(false)}} anchorOrigin={{vertical:"top",horizontal:"center"}}>
                <Alert
                    onClose={()=>{setOpen(false)}}
                    severity="warning"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    您的时间已经耗尽，请尽快结束回合
                </Alert>
            </Snackbar>
            </>
    )
}