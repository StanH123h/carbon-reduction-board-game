import * as React from "react";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import Button from "@mui/material/Button";
import {useState} from "react";

export const PopUp=({corpName,eventId,isOpen,handleClose})=>{
    return(
    <React.Fragment>
        <Dialog
            open={isOpen}
        >
            <DialogTitle>指标达成!</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    由<strong>{corpName}</strong>企业负责的ID为{eventId}的项目已经圆满完成<br/>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>好的</Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>
    )
}