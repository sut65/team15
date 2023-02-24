import React, { useEffect, useState } from "react";
import Container from '@mui/material/Container'
import TableCell from '@mui/material/TableCell';
import { Box, Grid, Select, TextField, Typography, Table, TableHead, TableRow, TableBody, Snackbar } from '@mui/material'
import Button from '@mui/material/Button'
import { Link as RouterLink } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import moment from 'moment';

import { PrescriptionInterface } from "../models/IPrescription";

function Prescription() {

    const [prescription, setPrescription] = React.useState<PrescriptionInterface[]>([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [ErrorMessage, setErrorMessage] = React.useState("");

    const getPrescription = async () => {
        const apiUrl = "http://localhost:8080/Prescriptions";
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        };
        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                console.log(res.data);
                if (res.data) {
                    setPrescription(res.data);
                }
            });
    };

    const DeletePrescription = async (id: string | number | undefined) => {
        const apiUrl = "http://localhost:8080";
        const requestOptions = {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        };
      
        fetch(`${apiUrl}/prescription/${id}`, requestOptions)
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
            getPrescription(); 
          }
        )
      }


      useEffect(() => {
        getPrescription();
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
                            ข้อมูลการสั่งยา
                        </Typography>
                    </Box>
                    <Box>

                        <Button

                            component={RouterLink}

                            to="/Prescription"

                            variant="contained"

                            color="primary"

                        >

                            เพิ่มข้อมูลการสั่งยา

                        </Button>

                    </Box>

                </Box>

                <TableContainer >

                    <Table aria-label="simple table">

                        <TableHead>
                            <TableRow>
                                <TableCell align="center" width="5%">
                                    ID
                                </TableCell>
                                <TableCell align="center" width="10%">
                                    เลขใบสั่งยา
                                </TableCell>
                                <TableCell align="center" width="10%">
                                    ชื่อยา
                                </TableCell>  
                                <TableCell align="center" width="20%">
                                    ผู้ป่วย
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    หมายเหตุ
                                </TableCell>
                                <TableCell align="center" width="10%">
                                    แพทย์
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    วันที่และเวลา
                                </TableCell>
                            </TableRow>

                        </TableHead>

                        <TableBody>
                            {prescription.map((prescription: PrescriptionInterface) => (
                            <TableRow key={prescription.ID}>
                                 <TableCell align="center" size="medium"> {prescription.ID}            </TableCell>
                                 <TableCell align="center" size="medium"> {prescription.Number}    </TableCell>
                                 <TableCell align="center" size="medium"> {prescription.MedicineLabel.Order.Medicine.Name}    </TableCell>
                                 <TableCell align="center" size="medium"> {prescription.Patient.Name}     </TableCell>
                                 <TableCell align="center" size="medium"> {prescription.Note}    </TableCell>
                                 <TableCell align="center" size="medium"> {prescription.Doctor.Name}    </TableCell>
                                 <TableCell align="center" > {moment(prescription.Datetime).format('DD MMMM yyyy')} </TableCell>
                                 <TableCell align="center"> 
                                <IconButton aria-label="delete" onClick={() => DeletePrescription(prescription.ID)}><DeleteIcon /></IconButton>
                                </TableCell>
                                <TableCell align="center"> 
                  <Button
                                                        variant='outlined'
                                                        color="primary"
                                                        component={RouterLink}
                                                        to={"/PrescriptionUpdate/" + prescription.ID}
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



export default Prescription;