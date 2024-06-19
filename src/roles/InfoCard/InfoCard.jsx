import * as React from 'react';
import {useContext, useState} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import "./InfoCard.scss"
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, TextField} from "@mui/material";
import products from "../../data/products.json"
import {EndRoundFuncContext} from "../../pages/MainGamePage/MainGamePage";
import projects from "../../data/projects.json"
import policies from "../../data/policies.json"

export const InfoCard = ({dataName, actionA, actionB, funcA, funcB, disableSnackBar, databaseA, databaseB}) => {
    const data = JSON.parse(localStorage.getItem(dataName))
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = useState(null);
    const [popUp, setPopUp] = useState(false)
    const [option, setOption] = useState(null)
    const endRound = useContext(EndRoundFuncContext)
    const customNames = JSON.parse(localStorage.getItem("custom_names"));
    const handleClickOpenA = () => {
        setOpen(true);
        setOption("A")
    };
    const handleClickOpenB = () => {
        setOpen(true);
        setOption("B")
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handlePopUp = (message) => {
        setMessage(message)
        setPopUp(true)
    }
    const database = {
        "products": products,
        "projects": projects,
        "policies": policies
    }
    return (
        <>
            <Card className={"info-card"}>
                <img src={data.img} alt="image" className={"info-img"}/>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {customNames[data.name]}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        你的身份是 {data.identity}
                    </Typography>
                </CardContent>
                {data.identity === "GOV" ?
                    <Button onClick={() => {
                        endRound()
                    }}>结束回合</Button>
                    : null
                }
                <CardActions className={"info-actions"}>
                    <Button size="small" onClick={() => {
                        handleClickOpenA()
                    }}>{actionA}</Button>
                    <Button size="small" onClick={() => {
                        handleClickOpenB()
                    }}>{actionB}</Button>
                </CardActions>
            </Card>
            <React.Fragment>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        component: 'form',
                        onSubmit: (event) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries(formData.entries());
                            const actionId = formJson.actionId;
                            handlePopUp(actionId);
                            option === "A" ? funcA(actionId, database[databaseA]) : funcB(actionId, database[databaseB])
                            handleClose();
                        },
                    }}
                >
                    <DialogTitle>采取行动</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            请输入对应的行动编号
                        </DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="name"
                            name={"actionId"}
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>取消</Button>
                        <Button type="submit">确定</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
            {disableSnackBar ? "" :
                <Snackbar
                    open={popUp}
                    autoHideDuration={3000}
                    onClose={() => {
                        setPopUp(false)
                    }}
                    message={"采取了行动" + message}
                />
            }
        </>
    );
}