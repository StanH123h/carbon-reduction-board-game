import "./TopTitleBar.scss"
export const TopTitleBar=(props)=>{
    const {title}=props
    return(
        <div className={"top-title-bar"}>
            {title}
        </div>
    )
}