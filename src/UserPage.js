import 'date-fns';
import React, { useState, useRef } from "react";
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom';
import * as Realm from "realm-web";
import {
    Grid,
    Container,
    makeStyles,
    CardHeader,
    Card,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
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
  

const UserPage = (props) => {

    const classes = useStyles();
    

    const app = new Realm.App({ id: "kadir-ceng495-suquq" });
    const credentials = Realm.Credentials.anonymous();
    loginFunction(app, credentials);

    const [gamesList, setGamesList] = useState([]);
    const [enableGameList, setEnableGameList] = useState([]);
    const [disableGameList, setDisableGameList] = useState([]);
    const [commentList, setCommentList] = useState([]);
    const [playedGameList, setPlayedGamesList] = useState([]);

    const getGameList = async function(app) {

        const mongodb = app.currentUser.mongoClient("mongodb-atlas");
        const games = mongodb.db("OynasanaDB").collection("Games");
    
        let gamesList = await games.find({});
        let gameNameList = [];
        let disableTemp = [];
        let enableTemp = [];
        gamesList.map((e) => {
            if (e.disable_comment === false) {
                disableTemp.push(e.name);
            } else {
                enableTemp.push(e.name);
            }
            gameNameList.push(e.name);
        }); 
    
        //console.log(gameNameList);
        setEnableGameList(enableTemp);
        setDisableGameList(disableTemp);
        setGamesList(gameNameList);
    }
    const getCanCommentOrRateGameList = async function(app){
        const mongodb = app.currentUser.mongoClient("mongodb-atlas");
        const games = mongodb.db("OynasanaDB").collection("Played");
    
        let playedGamesList = await games.find({user_name:localStorage.getItem('currentUserName')});
        let playedGameNameList = [];
        playedGamesList.map((e) => {
            playedGameNameList.push(e.game_name);
    });

    setPlayedGamesList(playedGameNameList);
    }

    const getCommentList = async function(app) {

        const mongodb = app.currentUser.mongoClient("mongodb-atlas");
        const comments = mongodb.db("OynasanaDB").collection("Comments");
    
        let commentListt = await comments.find({user_name: localStorage.getItem('currentUserName')});
        //console.log("commentlist:", commentListt);
        let commentTempList = [];
        commentListt.map((e) => {
            commentTempList.push({game: e['game_name'], comment: e['comment']});
        }); 
        console.log(commentTempList);
        setCommentList(commentTempList);
    }

    const getMostPlayed = async function(app){
        const mongodb = app.currentUser.mongoClient("mongodb-atlas");
        const played = mongodb.db("OynasanaDB").collection("Played");
        let result = await played.find({user_name: localStorage.getItem('currentUserName')});
        var maxtime = 0;
        var maxelname = '';
        for (var i = 0; i < result.length; i++){
            if(result[i]['played_time'] > maxtime){
                maxtime = result[i]['played_time'];
                maxelname = result[i]['game_name'];
            }
        }
        setMostPlayedGame(maxelname);
    }

    const getTotalPlay = async function(app){
        const mongodb = app.currentUser.mongoClient("mongodb-atlas");
        const played = mongodb.db("OynasanaDB").collection("Played");
        let result = await played.find({user_name: localStorage.getItem('currentUserName')});
        var totaltime = 0;
        for (var i = 0; i < result.length; i++){
                totaltime += result[i]['played_time'];
        }
        setTotalPlayTime(totaltime);
    }

    const getAverageRating = async function(app){
        const mongodb = app.currentUser.mongoClient("mongodb-atlas");
        const ratings = mongodb.db("OynasanaDB").collection("Ratings");
        var myratings = await ratings.find({user_name:localStorage.getItem('currentUserName')});
        var user_dict = {}
        var totalplay = 0;
        var average = 0;
        for(var j = 0 ; j < myratings.length; j++){
                average += parseInt(myratings[j]['rating']);
        }
        setAverageRating(average/myratings.length);
    }
    const [mostPlayedGame,setMostPlayedGame] = useState('');
    const [totalPlayTime,setTotalPlayTime] = useState(0);
    const [averageRating,setAverageRating] = useState(0);  

    const willMount = useRef(true);
    if (willMount.current) {
        getGameList(app);
        getCommentList(app);
        getCanCommentOrRateGameList(app);
        getMostPlayed(app).then(console.log(mostPlayedGame));
        getTotalPlay(app);
        getAverageRating(app);
        willMount.current = false;
    }

    const [selectedGameRate, setSelectedGameRate] = useState('');
    const [selectedGameComment, setSelectedGameComment] = useState('');
    const [selectedGamePlay, setSelectedGamePlay] = useState('');
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState('');  

    const [goGames, setGoGames] = useState(false);
    const handleChangeSelectedGameRate = (event) => {
        setSelectedGameRate(event.target.value);
      };

    const handleChangeSelectedGameComment = (event) => {
        setSelectedGameComment(event.target.value);
      };

    const handleChangeSelectedGamePlay = (event) => {
        setSelectedGamePlay(event.target.value);
      };

    const handleChangeRating = (event) => {
        setRating(event.target.value);
    }

    const handleChangeComment = (event) => {
        setComment(event.target.value);
    }

    const commentGame = async function(app,game,commentWrite){
        try {
            const mongodb = app.currentUser.mongoClient("mongodb-atlas");
            const comments = mongodb.db("OynasanaDB").collection("Comments");
            const result = await comments.updateOne(
                {   user_name: localStorage.getItem('currentUserName'),
                    game_name: game
                },
                    {$set: 
                        {
                        user_name: localStorage.getItem('currentUserName'),
                        game_name: game,
                        comment: commentWrite
                        }
                    },
                    {upsert:true}
                );
            alert('The comment is added!!');
            window.location.reload()
            //setAddGameState(initialAddGameState);
        }
        catch(error){
            console.log(error);
            alert('There is a problem!!')
        }
    }

    const rateGame = async function(app,game,ratingWrite){
        try {
            const mongodb = app.currentUser.mongoClient("mongodb-atlas");
            const ratings = mongodb.db("OynasanaDB").collection("Ratings");
            const result = await ratings.updateOne(
                {   user_name: localStorage.getItem('currentUserName'),
                    game_name: game
                },
                    {$set: 
                        {
                        user_name: localStorage.getItem('currentUserName'),
                        game_name: game,
                        rating: ratingWrite
                        }
                    },
                    {upsert:true}
                );
            console.log(result);
            alert('The rating is added!!');
            window.location.reload()
            //setAddGameState(initialAddGameState);
        }
        catch {
            alert('There is a problem!!')
        }
    }

    const playGame = async function(app,game){
        try {
            const mongodb = app.currentUser.mongoClient("mongodb-atlas");
            const played = mongodb.db("OynasanaDB").collection("Played");
            const old = await played.findOne({user_name:localStorage.getItem('currentUserName'),game_name: game});
            var playtime = 0;
            if(old != null){
                playtime = old['played_time'];
            }
            const result = await played.updateOne(
                {   user_name: localStorage.getItem('currentUserName'),
                    game_name: game},
                    {$set:    {user_name: localStorage.getItem('currentUserName'),
                                game_name: game,
                                played_time: playtime+1}
                            },
                    {upsert: true},
                );
            console.log(result);
            alert('The game is played for 1 hour more');
            window.location.reload()
            //setAddGameState(initialAddGameState);
        }
        catch {
            alert('There is a problem!!')
        }
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
                            <CardHeader title="User Profile" /> 
                            <p>Username: <span style={{fontWeight: 'bold'}}>{localStorage.getItem('currentUserName')}</span> </p>
                            <p>Most Played Game <span style={{fontWeight: 'bold'}}>{mostPlayedGame}</span></p>
                            <p>Total Play Time (hr) <span style={{fontWeight: 'bold'}}>{totalPlayTime.toString()}</span></p>
                            <p>Average of Ratings <span style={{fontWeight: 'bold'}}>{averageRating.toString()}</span></p>
                            <p>Comments</p>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Game</TableCell>
                                        <TableCell align="left">Comment</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {commentList.map((row) => {
                                        <TableRow component="td" key={row.game}>
                                            <TableCell scope="row">
                                            row['game']
                                            </TableCell>
                                            <TableCell align="left">row['comment']</TableCell>
                                        </TableRow>
                                    })}
                                </TableBody>
                            </Table>
                        </Card>
                    </Grid>
                    <Grid
                        item
                        lg={3}
                        md={4}
                        xl={4}
                        xs={12}
                    >
                        <Card className={classes.card}>
                            <CardHeader title="Comment Game" /> 
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                displayEmpty
                                value={selectedGameComment}
                                onChange={handleChangeSelectedGameComment}
                                >
                                    <MenuItem value="" disabled>
                                        Name of the Game
                                    </MenuItem>
                                    {playedGameList.filter(value => disableGameList.includes(value)).map(game => <MenuItem key={game} value={game}>{game}</MenuItem>)}
                            </Select>
                            <br/>
                            <input 
                                type="text"
                                name="comment"
                                value={comment}
                                onChange={handleChangeComment}
                                placeholder="Type your comment."
                            />
                            <br/>
                            <Button
                                variant="contained" 
                                color="primary" 
                                onClick={() => commentGame(app,selectedGameComment,comment)}
                            >
                                Make Comment
                            </Button>
                        </Card>
                    </Grid>
                    <Grid
                        item
                        lg={3}
                        md={4}
                        xl={4}
                        xs={12}
                    >
                        <Card className={classes.card}>
                            <CardHeader title="Rate Game" /> 
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                displayEmpty
                                value={selectedGameRate}
                                onChange={handleChangeSelectedGameRate}
                                >
                                    <MenuItem value="" disabled>
                                        Name of the Game
                                    </MenuItem>
                                    {playedGameList.filter(value => disableGameList.includes(value)).map(game => <MenuItem key={game} value={game}>{game}</MenuItem>)}
                            </Select>
                            <br/>
                            <Select
                                labelId="demo-simple-select-label-rating"
                                id="demo-simple-select-rating"
                                displayEmpty
                                value={rating}
                                onChange={handleChangeRating}
                                >
                                    <MenuItem value="" disabled>
                                        Rate 1-5
                                    </MenuItem>
                                    <MenuItem value={"1"}>1</MenuItem>
                                    <MenuItem value={"2"}>2</MenuItem>
                                    <MenuItem value={"3"}>3</MenuItem>
                                    <MenuItem value={"4"}>4</MenuItem>
                                    <MenuItem value={"5"}>5</MenuItem>
                            </Select>
                            <br/>
                            <Button
                                variant="contained" 
                                color="primary" 
                                onClick={() => rateGame(app,selectedGameRate,rating)}
                            >
                                Rate Game
                            </Button>
                        </Card>
                    </Grid>
                    <Grid
                        item
                        lg={3}
                        md={4}
                        xl={4}
                        xs={12}
                    >
                        <Card className={classes.card}>
                            <CardHeader title="Play Game" /> 
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                displayEmpty
                                value={selectedGamePlay}
                                onChange={handleChangeSelectedGamePlay}
                                >
                                    <MenuItem value="" disabled>
                                        Name of the Game
                                    </MenuItem>
                                    {gamesList.map(game => <MenuItem key={game} value={game}>{game}</MenuItem>)}
                            </Select>
                            <br/>
                            <Button
                                variant="contained" 
                                color="primary" 
                                onClick={() => playGame(app,selectedGamePlay)}
                            >
                                Play 1 Hour
                            </Button>
                        </Card>
                    </Grid>
                    <Grid
                    item
                        lg={3}
                        md={4}
                        xl={4}
                        xs={12}
                    >
                        <Card className={classes.card}>
                            <CardHeader title="Look Games" /> 
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
export default UserPage;