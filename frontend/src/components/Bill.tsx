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

import { BillsInterface } from "../models/IBill";

function Bills() {

    const [bill, setBill] = React.useState<BillsInterface[]>([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [ErrorMessage, setErrorMessage] = React.useState("");

    const getBill = async () => {
        const apiUrl = "http://localhost:8080/bills";
        const requestOptions = {
            method: "GET",
            headers: { 
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json" },
        };
        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                console.log(res.data);
                if (res.data) {
                    setBill(res.data);
                }
            });
    };
    const DeleteBill = async (id: string | number | undefined) => {
        const apiUrl = "http://localhost:8080";
        const requestOptions = {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        };
      
        fetch(`${apiUrl}/bills/${id}`, requestOptions)
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
            getBill(); 
          }
        )
      }

    useEffect(() => {
        getBill();
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
                            ข้อมูลการชำระเงิน
                        </Typography>
                    </Box>
                    <Box>

                        <Button

                            component={RouterLink}

                            to="/bill"

                            variant="contained"

                            color="primary"

                        >

                            เพิ่มข้อมูลการชำระเงิน

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
                                <TableCell align="center" width="15%">
                                    หมายเลขใบเสร็จ
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    ราคายา
                                </TableCell>
                                <TableCell align="center" width="10%">
                                    เลขใบสั้งยา/ชื่อยา
                                </TableCell>
                                <TableCell align="center" width="30%">
                                    รูปแบบการชำระเงิน
                                </TableCell>
                                <TableCell align="center" width="20%">
                                    วันที่ชำระเงิน
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    ผู้ชำระเงิน
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    ผู้รับการชำระเงิน
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    ลบข้อมูล
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    แก้ไขข้อมูล
                                </TableCell>
                            </TableRow>

                        </TableHead>

                        <TableBody>
                            {bill.map((bill: BillsInterface) => (
                            <TableRow key={bill.ID}>
                                 <TableCell align="center" size="medium"> {bill.ID}            </TableCell>
                                 <TableCell align="center" size="medium"> {bill.BillNo}    </TableCell>
                                 <TableCell align="center" size="medium"> {bill.Total}    </TableCell>
                                 <TableCell align="center" size="medium"> {bill.Prescription.Number} {bill.Prescription.MedicineLabel.Order.Medicine.Name}    </TableCell>
                                 <TableCell align="center" size="medium"> {bill.Paymentmethod.Name}     </TableCell>
                                 <TableCell align="center" > {moment(bill.BillTime).format('DD MMMM yyyy')} </TableCell>
                                 <TableCell align="center" size="medium"> {bill.Payer}     </TableCell>
                                 <TableCell align="center" size="medium"> {bill.Pharmacist.Name}     </TableCell>
                                 <TableCell align="center"> 
                                <IconButton aria-label="delete" onClick={() => DeleteBill(bill.ID)}><DeleteIcon /></IconButton>
                                </TableCell>
                                <TableCell align="center"> 
                  <Button
                                                        variant='outlined'
                                                        color="primary"
                                                        component={RouterLink}
                                                        to={"/BillUpdate/" + bill.ID}
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



export default Bills;