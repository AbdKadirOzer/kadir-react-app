import 'date-fns';
import React, { useState, useRef } from "react";
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import * as Realm from "realm-web";
import {
    Grid,
    Container,
    makeStyles,
    CardHeader,
    Card,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.background.dark,
      minHeight: '100%',
      paddingBottom: theme.spacing(3),
      paddingTop: theme.spacing(3)
    },
    tabRoot: {
      width: 'fit-content'
    },
    list: {
      padding: '5px',
    },
    button: {
      margin: theme.spacing(1),
      textTransform: 'none',
      fontSize: 16,
      backgroundColor: '#f7e2e2',
      color: '#ad3737'
    },
    action: {
      display: 'flex',
      justifyContent: 'space-around',
    },
    card: {
      width: '100%',
      backgroundColor: '#d9d1d1',
      padding: 5
    },
  }));

// Create an anonymous credential
const loginFunction = async function(app, credentials){
    try {
        // Authenticate the user
        const user = await app.logIn(credentials);
        //assert(user.id === app.currentUser.id)
        //console.log("Succesfully logged in ! ", user)
        return user
      } catch(err) {
        console.error("Failed to log in", err);
      }
}

const GamePage = () => {

    const classes = useStyles();
    

    const app = new Realm.App({ id: "kadir-ceng495-suquq" });
    const credentials = Realm.Credentials.anonymous();
    loginFunction(app, credentials);

    const [gamesList, setGamesList] = useState([]);
    const [goGames, setGoGames] = useState(false);

    const getGameList = async function(app) {

        const mongodb = app.currentUser.mongoClient("mongodb-atlas");
        const games = mongodb.db("OynasanaDB").collection("Games");
    
        let gamesList = await games.find({});
        let gameNameList = [];
        gamesList.map((e) => {
            gameNameList.push(e.name);
        }); 

        setGamesList(gameNameList);
    }

    const willMount = useRef(true);
    if (willMount.current) {
        getGameList(app);
        willMount.current = false;
    }

    return (
        <>
            <Container maxWidth={true}>
                <Grid
                    container
                    spacing={3}
                >
                    <Grid
                        item
                        lg={3}
                        md={4}
                        xl={4}
                        xs={12}
                    >
                        <Card className={classes.card}>
                            <CardHeader title="HOME" /> 
                            <br/>
                            <Button
                                variant="contained" 
                                color="primary" 
                                onClick={() => setGoGames(true)}>
                                Go
                            </Button>
                            {goGames && <Redirect to={{pathname:'/'}}></Redirect>}
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );    
}
export default GamePage;