import axios from "axios";
import React from "react";
import {useHistory} from "react-router-dom";
import "./Login.css";
const Login=()=>{
  let history=useHistory()
  const backendUrl="https://crudmernstackdeep.herokuapp.com/";
   const [user,setUser]=React.useState({
       email:"",
       Password:""
   });
   const handleChange=(e)=>{
        setUser({...user,[e.target.name]:e.target.value});
   }
   const handleSubmit=()=>{

                  if(user.email==="" || user.Password===""){
                    alert("Please Provide Enough Data");
                    history.push("/loginpart");
                  }
                  else{
                      

                      localStorage.setItem("token",user.email);
                 
                      history.push("/");
                  }

   }
  return(

    <div className="LoginContainer">
      
        <div>

                <div className="inputbox1">
                    <div>
                      <input type="email"name="email" placeholder="enter email here.." value={user.email} onChange={handleChange}></input>
                    </div>
                </div>
               <div className="inputbox2">
                     <input type="password" name="Password" placeholder="enter password here" value={user.Password} onChange={handleChange}></input>
               </div>
               <button className="btn btn-success text-white" onClick={handleSubmit}>Login</button>
        </div>


    </div>
  )
}
export default Login;