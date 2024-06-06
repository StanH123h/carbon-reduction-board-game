import {Button} from "@mui/material";
import "./StartingPage.scss";
import { useNavigate } from 'react-router-dom';
import {setUp} from "../initialSetups";
export const StartingPage=()=>{
    setUp()
    const navigate = useNavigate();

    return(
        <div className={"starting-page"}>
            <Button variant="contained" className={"button"} onClick={()=>{navigate('/transition')}}>Start</Button>
        </div>
    )
}