import Box from '@mui/material/Box';
import img from './image/pramacy.jpg';
import Paper from '@mui/material/Paper';
import { Container, Typography } from '@mui/material';

function Home() {

    return (
        <div>
        <Container className="container" maxWidth="md">
          <h1 style={{ textAlign: "center" }}>ระบบห้องยา</h1>
        <Typography component="h1" variant="h5">
          <img style={{width:"850px"}} className="img" src={img}/>
        </Typography>
      </Container>
    </div>
    )
}
export default Home;