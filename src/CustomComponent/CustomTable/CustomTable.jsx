// Importing all the required components
import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import CustomButton from "../CustomButton/CustomButton";
import { TextField } from "@mui/material";
import axios from "axios";
import { baseURL } from "../constant/Constant";

function descendingComparator(a, b, orderBy) { // to sort the data
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) { // this will help us to sort the data
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [  // Here we are giving the Heading to our table
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "Technologies",
    numeric: true,
    disablePadding: false,
    label: "Technologies",
  },
  {
    id: "Salary",
    numeric: true,
    disablePadding: false,
    label: "Salary",
  },
  {
    id: "Experience",
    numeric: true,
    disablePadding: false,
    label: "Experience",
  },
  {
    id: "Age",
    numeric: true,
    disablePadding: false,
    label: "Age",
  },
  {
    id: "Update",
    numeric: true,
    disablePadding: false,
    label: "Update",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,        //using PropType we are defining the type of the variables
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar({numSelected,handleDeleteClick}) { // destructuring the props
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Person Details
        </Typography>
      )}
{/* Here we are deleting the data based on their id using a function name handleDeleteClick*/}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={() => handleDeleteClick(true)}> 
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function CustomTable({ personData , removeUser , updateRender , timeToUpdateTable, countUpdateApi}) { // destructuring the props
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("Technologies"); // to sort the data
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0); //to set the pagination
  const [dense, setDense] = React.useState(false); // to shrink or expand the data on the table
  const [rowsPerPage, setRowsPerPage] = React.useState(5); // to check the rows per page
  const [editStates, setEditStates] = React.useState([]);
  const [deleteDataArray, setDeleteDataArray] = React.useState([]); // passing the array of data to delete the data based on array
  const [deleteDataFlag, setDeleteDataFlag] = React.useState(false); // delete flag to make the base check
  const [updateData , setUpdateData] = React.useState({
})
// Using the useState we are declaring the state or variable

const UpdateApiData = async (id) => { // this is the function to update the data
  try{
    const start = performance.now();// will fetch the start time 
    const response = await axios.patch(`${baseURL}/person/${id}`,updateData)
    const end = performance.now();// will fetch the end time 
    timeToUpdateTable(end - start);//updating the state based on the time taken
    UpdateApiData(true);
    countUpdateApi(1);
  }catch(error){
    console.log(error);
    updateRender(false)
  }
}

  const deleteDataFromTable = async () => { // this is the function to delete the data from the table 
    try {
      // console.log("Deleted Array : ", deleteDataArray);
      const start = performance.now();
      const resp = await axios.post(`${baseURL}/person/delete`, {
        ids : deleteDataArray,
      }); // this will delete the data
      const end = performance.now();
      removeUser(true , end - start);
      setDeleteDataFlag(false);
    } catch (error) {
      console.log(`Error : ${error}`);
      setDeleteDataFlag(false);
    }
  };

  React.useEffect(() => { // using useEffect to make an api call using callback and managing the lifecycle of the component
    if (deleteDataFlag) {
      deleteDataFromTable(); // this will call the delete api function 
    }
  }, [deleteDataFlag]); //passing the deleteDataFlag flag to call the delete api only when the flag is true this is to make the base check

  React.useEffect(() => { // using useEffect to make an api call using callback and managing the lifecycle of the component
    if (personData) {
      setEditStates(personData.map(() => false)); // here we are mapping the state 
    }
  }, [personData]); // calling the api based on the person data changes

  const handleRequestSort = (event, property) => { // sorting the data 
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => { // selecting all the data from the table
    if (event.target.checked) {
      const newSelected = personData.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => { // to change the page function 
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => { // to change the rows function 
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => { // to manage expand or contract the table 
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, personData?.length - page * rowsPerPage);

  const visibleRows = React.useMemo( // for memoization of the rows
    () =>
      stableSort(personData, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, personData]
  );

  function DeleteDataFromTable(deteledValue) { // this function will change the flag and this will trigger the api based on the dependency array provided 
    setDeleteDataFlag(deteledValue);
  }
  console.log("send update data : " , updateData);
  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          handleDeleteClick={DeleteDataFromTable}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={personData.length}
            />
            <TableBody>
              {visibleRows.map((data, index) => {  // this will map all the data in the row based on the data we have fetched 
                const isItemSelected = isSelected(data._id); // select the id of the particular object
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => {
                      handleClick(event, data._id);
                      if (isItemSelected) { // if isItemSelected is true then only it will proceed this is to make a base check
                        let index = deleteDataArray.indexOf(data._id); //  this will fetch the index value of based on that object
                        if (index !== -1) { // to check the boundary condition 
                          console.log("");
                          deleteDataArray.splice(index, 1); // this will delete the array with respect to the index value 
                        } else {
                          return;
                        }
                      } else {
                        setDeleteDataArray([...deleteDataArray, data?._id]);  // this we set the id in the array list this array we will pass to delete that object
                      }
                    }}
                    role="checkbox"  // will select the data or item
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={data.id}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox   // will select the particular object 
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                    {/* here we are passing the name fetched from the user api  */}
                      {data?.name}  
                    </TableCell>
                    <TableCell align="right">
                      {editStates[index] ? (
                        <TextField
                          sx={{ width: "30%", height: "2.4em" }}
                          id="filled-basic"
                          label=""
                          variant="filled"
                          // value={data?.tech}
                          onInput={(event) => {
                            setUpdateData({...updateData , tech : event?.target?.value }) // will update the object of we want to update the tech field of the particular object
                          }}
                        />
                      ) : (
                        data?.tech
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {editStates[index] ? (
                        <TextField
                          sx={{ width: "30%", height: "2.4em" }}
                          id="filled-basic"
                          label=""
                          variant="filled"
                          // value={data?.salary}
                          onInput={(event) => {
                            setUpdateData({...updateData , salary : event?.target?.value }) // will update the object of we want to update the salary field of the particular object
                          }}
                        />
                      ) : (
                        data?.salary
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {editStates[index] ? (
                        <TextField
                          sx={{ width: "30%", height: "2.4em" }}
                          id="filled-basic"
                          label=""
                          variant="filled"
                          // value={data?.experience}
                          onInput={(event) => {
                            setUpdateData({...updateData , experience : event?.target?.value }) // will update the object of we want to update the experience field of the particular object
                          }}
                        />
                      ) : (
                        data?.experience
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {editStates[index] ? (
                        <TextField
                          sx={{ width: "30%", height: "2.4em" }}
                          id="filled-basic"
                          label=""
                          variant="filled"
                          // value={data?.age}
                          onInput={(event) => {
                            setUpdateData({...updateData , age : event?.target?.value }) // will update the object of we want to update the age field of the particular object
                          }}
                        />
                      ) : (
                        data?.age
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {editStates[index] === false ? (
                        <CustomButton
                          label="Update"
                          handleClick={() => {
                            const newEditStates = [...editStates];
                            newEditStates[index] = !newEditStates[index]; // this will help us to edit the values based on the selected row
                            setEditStates(newEditStates);
                            console.log(data?._id);
                          }}
                        />
                      ) : (
                        <CustomButton
                          label="Done"
                          handleClick={() => {
                            const newEditStates = [...editStates];
                            newEditStates[index] = !newEditStates[index];
                            setEditStates(newEditStates);
                            UpdateApiData(data?._id)  // will call the update api and padding the object id to update the data 
                            updateRender(true); // flag to check and make the api call when required 
                          }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={personData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}  // adding the pagination to manage the data
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}