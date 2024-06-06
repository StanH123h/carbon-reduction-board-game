import {useEffect, useState} from "react";
import {LinearProgress} from "@mui/material";
import "./ProgressTab.scss"
export const ProgressTab = ({corpName, eventId, aimNum, currentNum}) => {
    const [progress, setProgress] = useState(0)
    useEffect(() => {
        setProgress(currentNum*100/aimNum)
    }, [currentNum]);
    return (
        <div className={"progress-tab"}>
            <span className={"name"}>{corpName}: {eventId}</span><
            LinearProgress variant={"determinate"} value={progress}
                           className={"tab"}
        />
            <span className={"progress"}>{currentNum}/{aimNum}</span>
        </div>
    )
}