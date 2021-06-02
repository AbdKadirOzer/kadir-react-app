import 'date-fns';
import Moment from 'react-moment';
import React, { useState, useRef } from "react";
import { Redirect, Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import * as Realm from "realm-web";
import {
    Grid,
    Container,
    makeStyles,
    CardHeader,
    Card,
    CardMedia
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
    media: {
      height: 400,
    }
  }));

// Create an anonymous credential
const loginFunction = async function(app, credentials){
    try {
        // Authenticate the user
        const user = await app.logIn(credentials);
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
    const [commentList, setCommentList] = useState([]);
    const [goGames, setGoGames] = useState(false);

    const getGameList = async function(app) {

      const mongodb = app.currentUser.mongoClient("mongodb-atlas");
      const games = mongodb.db("OynasanaDB").collection("Games");
      const played = mongodb.db("OynasanaDB").collection("Played");
      const ratings = mongodb.db("OynasanaDB").collection("Ratings");
      const comments = mongodb.db("OynasanaDB").collection("Comments");

      let gamesList = await games.find({});
      let myplaylist = await played.find({});
      let myratings = await ratings.find({});
      let mycomments = await comments.find({});

      let gameNameList = [];
      gamesList.map((e) => {
        gameNameList.push([e.name, e.genre, e.photo, e.release_date.toString()]);
      }); 

      let comments_advanced = [];
      comments.map((e) => {
        comments_advanced.push(
          {}
        )
      })
      setGamesList(gameNameList);
      setCommentList()
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
                    {gamesList.map((game) => (
                      <Grid
                        item
                        lg={3}
                        md={4}
                        xl={4}
                        xs={12}
                      >
                        <Card key={game[0]} className={classes.card}>
                            <CardHeader title={game[0]} /> 
                            <CardMedia
                              className={classes.media}
                              image={game[2]}
                              title={game[2]}
                            />
                            <p style={{fontWeight: 'bold'}}>Genre: <span style={{fontWeight: 'normal'}}>{game[1]}</span></p>
                            <p style={{fontWeight: 'bold'}}>Release Date: <span style={{fontWeight: 'normal'}}><Moment format="YYYY/MM/DD">{game[3]}</Moment></span></p>
                            <p style={{fontWeight: 'bold'}}>Rating: <span style={{fontWeight: 'normal'}}><Moment format="YYYY/MM/DD">{game[4]}</Moment></span></p>
                        </Card>
                    </Grid>
                    ))}
                    <Grid
                    item
                        lg={3}
                        md={4}
                        xl={4}
                        xs={12}
                    >
                        <Card className={classes.card}>
                            <CardHeader title="Go Home" /> 
                            <br/>
                                <Link to='/'>
                                <Button
                                variant="contained" 
                                color="primary" > Go </Button>
                                </Link>
                            
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );    
}
export default GamePage;