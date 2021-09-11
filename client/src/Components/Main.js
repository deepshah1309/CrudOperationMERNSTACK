import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import '@fortawesome/fontawesome-free/css/all.css';
import 'mdbreact/dist/css/mdb.css'

import DialogTitle from '@material-ui/core/DialogTitle';
// import useMediaQuery from '@material-ui/core/useMediaQuery';
// import { useTheme } from '@material-ui/core/styles';



import { MDBDataTableV5 } from 'mdbreact';
import './Main.css';
const Main = () => {
    // const theme = useTheme();
    // const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const getToken=localStorage.getItem("token");
    console.log(getToken,"got token");
    const backendUrl="https://crudmernstackdeep.herokuapp.com/";
    const [newData, setnewData] = useState({
        Name: "",
        PhoneNumber: "",
        Email: "",
        Hobbies: ""
    });
  
    const [message,setMessage]=useState("");
    const [openUpdateModal,setUpdateModal]=useState(false);
    const [finalData, setfinalData] = useState({});
    const [updateData,setupateData]=useState({
        _id:"",
        Name: "",
        PhoneNumber: "",
        Hobbies: ""
    })
    const [datatable, setDatatable] = useState({
        columns: [],
        rows: []
    });
    const handleCloseUpdate=()=>{
        setUpdateModal(false);
    }
    const handleUpdateChange=(e)=>{
        setupateData({ ...updateData, [e.target.name]: e.target.value });

    }
    const handleUpdateSubmit=(e)=>{
        e.preventDefault();
        setUpdateModal(false);
        axios.post(backendUrl+"update",updateData).then((response)=>{
                console.log(response);
                
                setMessage(response.data.message);
                setfinalData(updateData);
                
        })

    }
    const handleClickOpenDelete=(_id)=>{
      
        //process
 
          axios.post(backendUrl+"delete",{_id}).then((response)=>{
                  
                  console.log(response.data.datas);
                  setfinalData({_id:response.data.id});
                  setMessage("Id("+response.data.id+")  "+response.data.message);
                 
          })
          
        
      
     

  }
  
    const handleClickOpenUpdate=(_id)=>{
      
          //process
   
            axios.post(backendUrl+"fetchOne",{_id}).then((response)=>{
                    
                    console.log(response.data.datas);
                    setupateData(response.data.datas);
            })
            
            setUpdateModal(true);
        
       

    }
    useEffect(() => {
        axios.get(backendUrl + "fetch").then((response) => {
            let data = Object.values(response.data);

            data = data.map(function (item) { return { ...item, select: <input type="checkbox" name="user"  value={item._id}></input> ,
            Updatedelete:<div>
                <button className="btn" onClick={()=>handleClickOpenUpdate(item._id)}>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-xm-iLV3Ak8uK2CW-6iyXJUwztu72L-jFcA&usqp=CAU" alt="update" height="45" width="45" style={{borderRadius:"12px"}}></img>
                    </button><button className="btn" onClick={()=>handleClickOpenDelete(item._id)}>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR06fGkN3gnvKNKemZpHfz64exf1nibnis2jg&usqp=CAU" height="45" width="45" alt="delete" style={{borderRadius:"12px"}}></img>
                    </button></div>} });

            setDatatable({
                columns: [
                    {
                        label: 'select',
                        field: "select",
                        width: "auto"
                    },
                    {
                        label: 'Id',
                        field: '_id',
                        width: "auto"
                    },
                    {
                        label: 'username',
                        field: 'Name',
                        sort: 'asc',
                        width: "auto",
                    },
                    {
                        label: 'email',
                        field: 'Email',
                        sort: 'asc',
                        width: "auto"
                    },
                    {
                        label: "Ph",
                        field: "PhoneNumber",
                        width: "auto"
                    },
                    {
                        label: 'Hobbies',
                        field: 'Hobbies',
                        width: "auto"
                    },{
                        label:'Update/Delete',
                        field:'Updatedelete',
                        width:"auto"
                    }

                ], rows: data
            });
        });
    }, [finalData])
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleInsertSubmit = (e) => {
        e.preventDefault();
        setOpen(false);
        axios.post(backendUrl + "insert", newData).then((response) => {
            console.log(response);
            if (response.data.data === "exists") {


            }
            else if (response.data.data === "done") {
                setnewData({
                    Name: "",
                    PhoneNumber: "",
                    Email: "",
                    Hobbies: ""
                })
                setfinalData(response.data.dataId);

            }

        })
    }
    const handleInsertChange = (e) => {

        setnewData({ ...newData, [e.target.name]: e.target.value });
        console.log(newData);

    }


    const handleSend=()=>{
        var markedCheckbox = document.getElementsByName('user');  
            var objarray=[];
            for (var checkbox of markedCheckbox) {  
                if (checkbox.checked){
                    objarray.push(checkbox.value);  
                }  
            }  
            var objects={
                    value:objarray
            }
            axios.post(backendUrl+"sendMail",objects).then((response)=>{
                    if(response.data.status===1){
                        setMessage("Mail has been sent with selected data");
                    }
            })
    }


    return (
        getToken!==null?(
        <>
            <div className="container-fluid">
            <nav class="navbar-expand-lg  navbar navbar-dark bg-primary">
  <a class="navbar-brand" href="/">MernStackTask</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
</nav>
                <Dialog open={open}  onClose={handleClose} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Insert Data</DialogTitle>
                            <DialogContent className="text-dark" style={{fontSize:"1rem"}}>

                                <form onSubmit={handleInsertSubmit} method="POST">
                                    <label htmlFor="Name"><h3>Name:</h3></label>
                                    <input type="text" id="Name" name="Name" value={newData.Name} onChange={handleInsertChange} required></input>

                                    <br></br>
                                    <label htmlFor="phoneNumber"><h3>PhoneNumber:</h3></label>
                                    <input type="tel" id="phoneNumber" value={newData.PhoneNumber} name="PhoneNumber" onChange={handleInsertChange} required></input>
                                    <br></br>
                                    <label htmlFor="email"><h3>Email:</h3></label>
                                    <input type="email" id="email" name="Email" value={newData.Email} onChange={handleInsertChange} required></input>
                                    <br></br>
                                    <label htmlFor="hobbies"><h3>Hobbies:</h3></label>
                                    <input type="text" id="hobbies" name="Hobbies" value={newData.Hobbies} onChange={handleInsertChange} required></input>
                                    <br></br>
                                    <br></br>
                                    <button type="submit" className="btn btn-success text-white">Insert</button>
                                </form>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    Cancel
          </Button>

                            </DialogActions>
                        </Dialog>
                        <Dialog open={openUpdateModal}  onClose={handleCloseUpdate} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Update Data</DialogTitle>
                            <DialogContent>

                                <form onSubmit={handleUpdateSubmit} method="POST">
                                    <label htmlFor="Name"><h3>Enter Name{updateData.Name}</h3></label>
                                    <input type="text" id="Name" name="Name" value={updateData.Name} onChange={handleUpdateChange} required></input>

                                    <br></br>
                                    <label htmlFor="phoneNumber"><h3>Enter PhoneNumber:</h3></label>
                                    <input type="tel" id="phoneNumber" value={updateData.PhoneNumber} name="PhoneNumber" onChange={handleUpdateChange} required></input>
                                    <br></br>
                                    
                                    <br></br>
                                    <label htmlFor="hobbies"><h3>Enter your Hobbies:</h3></label>
                                    <input type="text" id="hobbies" name="Hobbies" value={updateData.Hobbies} onChange={handleUpdateChange} required></input>
                                    <br></br>
                                    <br></br>
                                    <button type="submit" className="btn btn-success text-white">Update</button>
                                </form>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseUpdate} color="primary">
                                    Cancel
          </Button>

                            </DialogActions>
                        </Dialog>
                <div className="row">

                    <div>
                        <h2 className="bg-success text-white">{message}</h2>
                        <br></br>
                        <button onClick={handleClickOpen} className="btn border-primary rounded-pill">
                            <b>Insert<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZmAJcqj4qSFhOT0HWtRRSZ68FyHrbm21vnQ&usqp=CAU" alt="add" height="60" width="60"></img></b>
                        </button>
                        <button className="btn text-dark btn-white border-primary rounded-pill" onClick={handleSend}>
                            <b>Send<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4jydI5gNNiEFPc1G7HHhUTudbRSAxzswrog&usqp=CAU" alt="send" height="60" width="60"></img></b>
                        </button>
                        
   
                        
                        
                        <br></br>
                        <div className="setinside w-100">
                            <MDBDataTableV5
                                responsiveSm
                                responsiveMd
                                responsiveLg
                                striped
                                hover
                                theadTextWhite
                                theadColor="indigo"
                                data={datatable}
                                dark
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>):(<div><h1 className="bg-danger text-white">sorry you are not authorized!!</h1><br/>
              <div className="v text-center bg-dark text-white h-100">
                  <a href="/loginpart" className="text-decoration-none bg-success border-rounded-pill text-white loginBtn">Login</a>
                </div>
        </div>)
    )
}
export default Main;