import React, { useEffect } from "react";
import Container from '@mui/material/Container'
import TableCell from '@mui/material/TableCell';
import { Box, Grid, Select, TextField, Typography, Table, TableHead, TableRow, TableBody } from '@mui/material'
import Button from '@mui/material/Button'
import { Link as RouterLink } from "react-router-dom";
import TableContainer from '@mui/material/TableContainer';
import moment from 'moment';
import { ReturnInterface } from "../models/IReturn";

export default function MedicineReturnList() {
   
  const [Return, setAmbulances] = React.useState<ReturnInterface[]>([]);

    
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

    useEffect(() => {
      getMedicineLabels();
    }, []);

    return (

        <div>
<Container maxWidth="md">

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
                  หมายเลขใบชำระเงิน
                </TableCell>
                <TableCell align="center" width="14%">
                  ชื่อยา
                </TableCell>
                <TableCell align="center" width="14%">
                  เหตุผลการคืนยา
                </TableCell>
                <TableCell align="center" width="10%">
                  เจ้าหน้าที่รับคืนยา
                </TableCell>
                <TableCell align="center" width="14%">
                  คำแนะนำ
                </TableCell>
                <TableCell align="center" width="13%">
                  วันที่รับคืน
                </TableCell>
                <TableCell align="center" width="10%">
                  ผู้บันทึก
                </TableCell>
              </TableRow>
            </TableHead>
             <TableBody>
              {Return.map((Return: ReturnInterface) => (
                <TableRow key={Return.ID}>
                  <TableCell align="center">{Return.DispenseMedicine.DispenseNo.valueOf()}</TableCell>
                
                  <TableCell align="center">{Return.Staff.StaffName}</TableCell>
                  <TableCell align="center">{Return.Reason.ReasonName}</TableCell>
                  <TableCell align="center" > {moment(Return.ReturnDate).format('MMMM DD yyyy')}     </TableCell>
                  <TableCell align="center" size="medium"> {Return.Pharmacist.Name}     </TableCell>
                  
                </TableRow>
              ))}
            </TableBody>

                    </Table>

                </TableContainer>

            </Container>

        </div>
    );
}


