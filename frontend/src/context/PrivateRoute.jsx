import {Route, redirect} from "react-router-dom"
import {useContext} from "react"
import AuthContext from "./AutoContext"


const PrivateRoute = ({children, ...rest}) => {
    let {user} = useContext(AuthContext)
    return (<Route {...rest}>{!user ? redirect("/auth") : children}</Route>)
}

export default PrivateRoute;