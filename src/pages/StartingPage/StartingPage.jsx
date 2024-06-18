import {Button, Input} from "@mui/material";
import "./StartingPage.scss";
import {useNavigate} from 'react-router-dom';
import {setUp} from "../initialSetups";
import {useRef} from "react";

export const StartingPage = () => {
    let customNames = JSON.parse(localStorage.getItem("custom_names"))
    const civil1CustomName = useRef(null)
    const civil2CustomName = useRef(null)
    const civil3CustomName = useRef(null)
    const ent1CustomName = useRef(null)
    const ent2CustomName = useRef(null)
    const govCustomName = useRef(null)
    setUp()
    const navigate = useNavigate();

    return (
        <div className={"starting-page"}>
            <div>公民1自定义名称:<Input placeholder={"civil_1"} inputRef={civil1CustomName}/></div>
            <div>公民2自定义名称:<Input placeholder={"civil_2"} inputRef={civil2CustomName}/></div>
            <div>公民3自定义名称:<Input placeholder={"civil_3"} inputRef={civil3CustomName}/></div>
            <div>企业1自定义名称:<Input placeholder={"entrepreneur_1"} inputRef={ent1CustomName}/></div>
            <div>企业2自定义名称:<Input placeholder={"entrepreneur_2"} inputRef={ent2CustomName}/></div>
            <div>政府自定义名称:<Input placeholder={"government"} inputRef={govCustomName}/></div>
            <br/>
            <Button variant="contained" className={"button"} onClick={() => {
                if (civil1CustomName.current && civil1CustomName.current.value) {
                    customNames["civil_1"] = civil1CustomName.current.value;
                }
                if (civil2CustomName.current && civil2CustomName.current.value) {
                    customNames["civil_2"] = civil2CustomName.current.value;
                }
                if (civil3CustomName.current && civil3CustomName.current.value) {
                    customNames["civil_3"] = civil3CustomName.current.value;
                }
                if (ent1CustomName.current && ent1CustomName.current.value) {
                    customNames["entrepreneur_1"] = ent1CustomName.current.value;
                }
                if (ent2CustomName.current && ent2CustomName.current.value) {
                    customNames["entrepreneur_2"] = ent2CustomName.current.value;
                }
                if (govCustomName.current && govCustomName.current.value) {
                    customNames["government"] = govCustomName.current.value;
                }
                localStorage.setItem("custom_names",JSON.stringify(customNames))
                navigate("/transition")
            }}>Start</Button>
        </div>
    )
}