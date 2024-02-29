import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import CustomButton from "../CustomComponent/CustomButton/CustomButton";
import CustomTable from "../CustomComponent/CustomTable/CustomTable";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CustomTextField from "../CustomComponent/CustomTextField/CustomTextField";
import axios from "axios";
import { baseURL } from "../CustomComponent/constant/Constant";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "35%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderColor: "#ffff",
  borderRadius: "12px",
};

const MainPage = () => {
  const [open, setOpen] = useState(false); // state to make modal open or close
  const handleOpen = () => setOpen(true); // handler for opening the modal
  const handleClose = () => setOpen(false); // handler for closing the modal
  const [personData, setPersonData] = useState(null); // creating the setState to store the data in the variable
  const [addUserData, setAddUserData] = useState({
    name: null,
    tech: null,
    salary: null,
    experience: null,
    age: null,
  });
  const [addUserFlag, setAddUserFlag] = useState(false); // this state is used to manage the Add User
  const [removeUserFlag, setRemoveUserFlag] = useState(false); // flag to make user api call when required
  const [updateFlag, setUpdateFlag] = useState(false); // flag to call update api when required
  const [tableDataApiTime, setTableDataApiTime] = useState(""); // to set the table data
  const [timeTakenByAddUser, setTimeTakenByAddUser] = useState(""); //time taken to add the user
  const [timeTakenToUpdatTable, setTimeTakenToUpdatTable] = useState("");// to set the time taken to update the table
  const [timeTakenToRemoveUser, setTimeTakenToRemoveUser] = useState(""); // to set the time taken to remove the user
  const [apiCountGetData , setApiCountGetData] = useState(0); // to get number to time get user data api being called
  const [apiCountAddData , setApiCountAddData] = useState(0); //to get number of time api being called while adding the person data
  const [apiCountUpdateAPI , setApiCountUpdateAPI] = useState(0); // to get the number of times update APi us being called 

  const timeToUpdateTable = (value) => { // to lift up the data from the child component
    setTimeTakenToUpdatTable(value);
  };

  const updateRender = (value) => { // to lift up the data from the child component
    setUpdateFlag(value);
  };

  const countUpdateApi = (value) => {  // to lift up the data from the child component to set the number of api calls for update api
    setApiCountUpdateAPI( () => apiCountUpdateAPI+value );
  }

  const removeUserFlagfunction = (value, timeTakenToRemoveTheUser) => {
    setRemoveUserFlag(value);
    setTimeTakenToRemoveUser(timeTakenToRemoveTheUser);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseURL}/person`);
      setPersonData(response?.data); // using setPersonData to storing the data fetched by the api
      // using optional chaining if personData is not available it will not throw the error
    } catch (error) {
      console.log(error);
    }
  };

  const AddUser = async () => {
    try {
      const start = performance.now(); // will fetch the start time
      const resp = await axios.post(`${baseURL}/person`, addUserData); // fetching the data of all the users
      const end = performance.now(); // will fetch the end time
      setTimeTakenByAddUser(end - start); //updating the state based on the time taken
      setAddUserFlag(false);
      setApiCountAddData( () => setApiCountAddData(apiCountAddData + 1) );
    } catch (error) {
      console.log(error);
      setAddUserFlag(false);
    }
  };

  useEffect(() => {
    if (addUserFlag) {
      AddUser();
    }
  }, [addUserFlag]);

  useEffect(() => {
    const start = performance.now(); // will fetch the start time
    fetchData();
    const end = performance.now(); // will fetch the end time
    setTableDataApiTime(end - start); // updating the state based on the time taken
    setApiCountGetData( () => setApiCountGetData(apiCountGetData + 1) )
  }, [addUserFlag, removeUserFlag, updateFlag]); // based on these dependencies array out data api will be called and will populate our table

  // if(!personData) return null
  console.log("Count Api Data : ",apiCountGetData);
  return (
    <>
      <h1>DataNeuron Assignment</h1>
      <h2>Name : Moiz Ur Rehman</h2>
      <p>{`Time taken to get Data is ${tableDataApiTime}ms.`}</p>
      <p>
        {timeTakenByAddUser
          ? `Time taken to Add User is ${timeTakenByAddUser}ms`
          : null}
      </p>
      {/* using ternary operator to check if value is there render the data otherwise render null */}
      <p>
        {timeTakenToUpdatTable
          ? `Time taken to update the table ${timeTakenToUpdatTable}ms : `
          : null}
      </p>
      <p>
        {timeTakenToRemoveUser
          ? `Time Taken To remove the user ${timeTakenToRemoveUser}ms`
          : null}
      </p>
      {/* Count for API calls */}
      <p>{`API count for getting the data : ${apiCountGetData}`}</p>
      {/* APi count for updating the data */}
      <p>{`API count for Adding the data :  ${apiCountAddData}`}</p>
      {/* APi count for updating the API */}
      <p>{`API Count for updating the api : ${apiCountUpdateAPI} `}</p>


      {/* Modal to inset the data into the table */}
      {/* called the custom button to to open the modal to make entries  */}
      <CustomButton
        isTransaprent={false}
        buttonCss={buttoncss}
        label={"Add the data"}
        handleClick={handleOpen} // handle open will open the modal
      />
      <Modal
        open={open}
        onClose={handleClose} // handle close will close the modal
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* passed the style as a object to apply the css in to the modal  */}
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Insert the new user into the table
          </Typography>
          {/* Created the custom text field to enter the data into the table*/}
          <Box
            sx={{ display: "flex", flexDirection: "column", flexWrap: "wrap" }}
          >
            <CustomTextField
              style={{ margin: "1%" }}
              helperText={""}
              defaultValue={addUserData?.name}
              label="Enter Name"
              onChange={(event) => {
                setAddUserData({ ...addUserData, name: event?.target?.value }); //setting the data using spread operator in object of addUserData  then using key to manipulate the data
              }}
            />
            <CustomTextField
              style={{ margin: "1%" }}
              helperText={""}
              defaultValue={addUserData?.tech}
              label="Technologies"
              onChange={(event) => {
                setAddUserData({ ...addUserData, tech: event?.target?.value }); //setting the data using spread operator in object of addUserData  then using key to manipulate the data
              }}
            />
            <CustomTextField
              style={{ margin: "1%" }}
              helperText={""}
              defaultValue={addUserData?.salary}
              label="Salary"
              onChange={(event) => {
                setAddUserData({
                  ...addUserData,
                  salary: event?.target?.value, //setting the data using spread operator in object of addUserData  then using key to manipulate the data
                });
              }}
            />
            <CustomTextField
              style={{ margin: "1%" }}
              helperText={""}
              defaultValue={addUserData?.experience}
              label="Experience in Years"
              onChange={(event) => {
                setAddUserData({
                  ...addUserData,
                  experience: event?.target?.value, //setting the data using spread operator in object of addUserData  then using key to manipulate the data
                });
              }}
            />
            <CustomTextField
              style={{ margin: "1%" }}
              helperText={""}
              defaultValue={addUserData?.age}
              label="Age"
              onChange={(event) => {
                setAddUserData({ ...addUserData, age: event?.target?.value }); //setting the data using spread operator in object of addUserData  then using key to manipulate the data
              }}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CustomButton
              buttonCss={{
                marginTop: "2%",
                backgroundColor: "#00FF00",
                color: "#000000",
                fontWeight: 700,
                borderRadius: "20px",
              }}
              handleClick={() => {
                setAddUserFlag(true); // Adding flag to make it work only when it is required
                handleClose();
              }}
              label="Add Data"
            />
          </Box>
        </Box>
      </Modal>
      {/* Table component to show the data */}
      {personData ? (
        <CustomTable
          personData={personData} // passing the data using props to other components
          removeUser={removeUserFlagfunction}
          updateRender={updateRender}
          timeToUpdateTable={timeToUpdateTable} //here we are lifting up the state to update our variables
          countUpdateApi={countUpdateApi}
        />
      ) : null}{" "}
      Passing the person data to table component using the props
      <Outlet />
    </>
  );
};
// Writing the css of button
const buttoncss = {
  backgroundColor: "#00FF00",
  color: "#000000",
  fontWeight: 700,
  border: "none",
  borderRadius: "1.3em",
};

export default MainPage;
// using outlet form react router dom to render the child component in the parent component
