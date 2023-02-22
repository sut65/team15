import React, { useEffect, useState  } from "react";
import Container from '@mui/material/Container'
import TableCell from '@mui/material/TableCell';
import { Box, Grid, Select, TextField, Typography, Table, TableHead, TableRow, TableBody } from '@mui/material'
import Button from '@mui/material/Button'
import { Link as RouterLink } from "react-router-dom";
import TableContainer from '@mui/material/TableContainer';
import moment from 'moment';
import { ReturnInterface } from "../models/IReturn";
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

export default function MedicineReturnList() {
   
  const [Return, setAmbulances] = React.useState<ReturnInterface[]>([]);
  const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [ErrorMessage, setErrorMessage] = React.useState("");

    
      const apiUrl = "http://localhost:8080";
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      };
    
      const getMedicineLabels = async () => {
        fetch(`${apiUrl}/medicinereturns`, requestOptions)
          .then((response) => response.json())
          .then((res) => {
              console.log(res.data);
            if (res.data) {
              setAmbulances(res.data);
            } else {
              console.log("else");
            }
          });
      };

      
    const DeleteMedicineReturn = async (id: string | number | undefined) => {
      const apiUrl = "http://localhost:8080";
      const requestOptions = {
          method: "DELETE",
          headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
          },
      };

      fetch(`${apiUrl}/medicinereturns/${id}`, requestOptions)
          .then((response) => response.json())
          .then(
              (res) => {
                  if (res.data) {
                      setSuccess(true)
                      console.log("ยกเลิกสำเร็จ")
                      setErrorMessage("")
                  }
                  else {
                      setErrorMessage(res.error)
                      setError(true)
                      console.log("ยกเลิกไม่สำเร็จ")
                  }
                  getMedicineLabels();
              }
          )
  }

    useEffect(() => {
      getMedicineLabels();
    }, []);

    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
      props,
      ref,
    ) {
      return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleClose = (res: any) => {
      if (res === "clickaway") {
        return;
      }
      setSuccess(false);
      setError(false);
    };

    return (

        <div>
<Container maxWidth="md">
<Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          ลบข้อมูลสำเร็จ
        </Alert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          ลบข้อมูลไม่สำเร็จ : {ErrorMessage}
        </Alert>
      </Snackbar>


<Box

    display="flex"

    sx={{

        marginTop: 2,

    }}

>

    <Box flexGrow={1}>

        <Typography
            component="h2"
            variant="h6"
            color="primary"
            gutterBottom
        >
            ข้อมูลยา
        </Typography>
    </Box>
    <Box>

        <Button

            component={RouterLink}

            to="/MedicineReturn"

            variant="contained"

            color="primary"

        >

            เพิ่มข้อมูลยา

        </Button>

    </Box>

</Box>
        <TableContainer >

                    <Table aria-label="simple table">
                    <TableHead>
              <TableRow>
              <TableCell align="center" width="10%">
                  หมายเลขใบคืนยา
                </TableCell>
                <TableCell align="center" width="10%">
                 หมายเลขใบจ่ายเงิน
                </TableCell>
                <TableCell align="center" width="14%">
                  ชื่อยา
                </TableCell>
                <TableCell align="center" width="13%">
                  สาเหตุที่คืน
                </TableCell>
                <TableCell align="center" width="10%">
                  เจ้าหน้าที่รับคืนยา
                </TableCell>
                <TableCell align="center" width="14%">
                  หมายเหตุ
                </TableCell>
                <TableCell align="center" width="13%">
                  วันที่รับคืน
                </TableCell>
                <TableCell align="center" width="10%">
                  ผู้บันทึก
                </TableCell>
                <TableCell align="left" width="20%">
                  ลบข้อมูล
                </TableCell>  
                <TableCell align="left" width="20%">
                  แก้ไขข้อมูล
                </TableCell>  
                 
                 
              </TableRow>
            </TableHead>
             <TableBody>
              {Return.map((Return: ReturnInterface) => (
                <TableRow key={Return.ID}>
                   <TableCell align="center" size="medium"> {Return.MedicineReturnNo}    </TableCell>
                  <TableCell align="center">{Return.DispenseMedicine.DispenseNo}</TableCell>
                  <TableCell align="center">{Return.Order.Medicine.Name}</TableCell>
                  <TableCell align="center">{Return.Reason.ReasonName}</TableCell>
                  <TableCell align="center">{Return.Staff.StaffName}</TableCell>
                  <TableCell align="center" vertical-align= "middle" >{Return.Note}</TableCell>
                  <TableCell align="center" > {moment(Return.ReturnDate).format('MMMM DD yyyy')}     </TableCell>
                  <TableCell align="center" size="medium"> {Return.Pharmacist.Name}     </TableCell>
                  <TableCell align="center"> 
                  <IconButton  aria-label="delete" vertical-align= "middle" onClick={() => DeleteMedicineReturn(Return.ID)}><DeleteIcon /></IconButton >
                  </TableCell>
                  <TableCell align="center"> 
                  <Button
                                                        variant='outlined'
                                                        color="primary"
                                                        component={RouterLink}
                                                        to={"/MedicineReturnUpdate/" + Return.ID}
                                                    >
                                                        แก้ไขข้อมูล
                                                    </Button>
                  </TableCell>
                  
                </TableRow>
              ))}
            </TableBody>

                    </Table>

                </TableContainer>

            </Container>

        </div>
    );
}


