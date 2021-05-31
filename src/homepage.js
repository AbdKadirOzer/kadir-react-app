import 'date-fns';
import React, { useState, useRef } from "react";
import { Redirect } from 'react-router-dom';
import DateFnsUtils from '@date-io/date-fns';
import Button from '@material-ui/core/Button';
import * as Realm from "realm-web";
import {
    Grid,
    Container,
    makeStyles,
    CardHeader,
    Card,
    Select,
    MenuItem
} from '@material-ui/core';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
  } from '@material-ui/pickers'; 

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

const addTest = async function(app){
    const mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const games = mongodb.db("OynasanaDB").collection("Games");
    const result = await games.insertOne(
        {
          name: "CoD2",
          genre: "Action",
          photo: "EMPTY",
          disable_rating: false,
          disable_comment: false,
              }
    )
    console.log(result);
  }
  



const Homepage = () => {

    const classes = useStyles();
    

    const app = new Realm.App({ id: "kadir-ceng495-suquq" });
    const credentials = Realm.Credentials.anonymous();
    loginFunction(app, credentials);

    const [gamesList, setGamesList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [enableGameList, setEnableGameList] = useState([]);
    const [disableGameList, setDisableGameList] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);
    const [goGames, setGoGames] = useState(false);
    const genreList = ['Action', 'Adventure', 'Sport', 'Thriller', 'Strategy'];

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

    const getUserList = async function(app) {

        const mongodb = app.currentUser.mongoClient("mongodb-atlas");
        const users = mongodb.db("OynasanaDB").collection("User");
    
        let userList = await users.find({});
        console.log("userlist:", userList);
        let userNameList = [];
        userList.map((e) => {
            userNameList.push(e.name);
        }); 
    
        //console.log(gameNameList);
    
        setUserList(userNameList);
    }

    const willMount = useRef(true);
    if (willMount.current) {
        getGameList(app);
        getUserList(app);
        willMount.current = false;
    }

    const initialAddGameState = {
        name: "",
        genre: "",
        photo: "",
        disableRating: false,
        disableComment: false,
    }

    const [addGameState, setAddGameState] = useState(initialAddGameState)
    const [selectedDate, setSelectedDate] = React.useState(new Date('2021-05-29T21:11:54'));
    const [selectedGame, setSelectedGame] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedDisable, setSelectedDisable] = useState('');
    const [selectedEnable, setSelectedEnable] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [userName, setUserName] = useState('');
    const [loginUserName, setLoginUserName] = useState('');

    const handleChangeSelectedGame = (event) => {
        setSelectedGame(event.target.value);
      };

    const handleChangeSelectedGenre = (event) => {
        setSelectedGenre(event.target.value);
    };

    const handleChangeSelectedUser = (event) => {
        setSelectedUser(event.target.value);
      };

    const handleChangeSelectedDisable = (event) => {
        setSelectedDisable(event.target.value);
      };

    const handleChangeSelectedEnable = (event) => {
        setSelectedEnable(event.target.value);
      };

    const handleDateChange = (date) => {
        setSelectedDate(date);
      };

    const handleChangeAddGameState = (event) => {
        setAddGameState({
            ...addGameState,
            [event.target.name]: event.target.value
        });
    }

    const handleChangeUserName= (event) => {
        setUserName(event.target.value);
    }

    const handleChangeLoginUserName= (event) => {
        setLoginUserName(event.target.value);
    }

    const handleChangeAddGameSwitch = (event) => {
        setAddGameState({
            ...addGameState,
            [event.target.name]: event.target.checked
        });
    }

    const addGame = async function(app,data){
        try {
            const mongodb = app.currentUser.mongoClient("mongodb-atlas");
            const games = mongodb.db("OynasanaDB").collection("Games");
            const result = await games.insertOne(data);
            console.log(result);
            alert('The game is added!!');
            setAddGameState(initialAddGameState);
            window.location.reload()
        }
        catch {
            alert('There is a problem!!')
        }
      }

    const addUser = async function(app,data){
        try {
            const mongodb = app.currentUser.mongoClient("mongodb-atlas");
            const users = mongodb.db("OynasanaDB").collection("User");
            const result = await users.insertOne({name: data});
            console.log(result);
            alert('The user is added!!');
            window.location.reload()

        }
        catch {
            alert('There is a problem!!')
        }
      }

    const userCheck = async function(app,data){
        try {
            const mongodb = app.currentUser.mongoClient("mongodb-atlas");
            const users = mongodb.db("OynasanaDB").collection("User");
            const result = await users.find({name: data});
            if (result.length === 1) {
                setLoggedIn(true);
                localStorage.setItem('currentUserName', data)
            } else {
                alert('Invalid username!!')
            }
            console.log(result);
            alert('The user is logged in !!');
            window.location.reload()
        }
        catch {
            alert('There is a problem!!')
        }
      }

    const removeGame = async function(app,removedName){
        try {
            const mongodb = app.currentUser.mongoClient("mongodb-atlas");
            const games = mongodb.db("OynasanaDB").collection("Games");
            const result = await games.deleteOne({ name: removedName });
            console.log(result);
            alert('The game is removed!!');
            window.location.reload()
            //setAddGameState(initialAddGameState);
        }
        catch {
            alert('There is a problem!!')
        }
    }

    const disableCommentFunc = async function(app,updatedName){
        try {
            const mongodb = app.currentUser.mongoClient("mongodb-atlas");
            const games = mongodb.db("OynasanaDB").collection("Games");
            const result = await games.updateOne(
                { name: updatedName },
                { $set: { disable_comment: true } });
            console.log(result);
            alert('The game is disabled!!');
            window.location.reload()
            //setAddGameState(initialAddGameState);
        }
        catch {
            alert('There is a problem!!')
        }
    }

    const enableCommentFunc = async function(app,updatedName){
        try {
            const mongodb = app.currentUser.mongoClient("mongodb-atlas");
            const games = mongodb.db("OynasanaDB").collection("Games");
            const result = await games.updateOne(
                { name: updatedName },
                { $set: { disable_comment: false } });
            console.log(result);
            alert('The game is enabled!!');
            window.location.reload()
            //setAddGameState(initialAddGameState);
        }
        catch {
            alert('There is a problem!!')
        }
    }

    const removeUser = async function(app,removedName){
        try {
            const mongodb = app.currentUser.mongoClient("mongodb-atlas");
            const users = mongodb.db("OynasanaDB").collection("User");
            const result = await users.deleteOne({ name: removedName });
            console.log(result);
            alert('The user is removed!!');
            window.location.reload()
            //setAddGameState(initialAddGameState);
        }
        catch {
            alert('There is a problem!!')
        }
    }
    
    let addGameData ={
        name: addGameState.name,
        genre: selectedGenre,
        photo: addGameState.photo,
        disable_rating: addGameState.disableRating,
        disable_comment: addGameState.disableComment,
        release_date: selectedDate
    };


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
                            <CardHeader title="Add Game" /> 
                            <input 
                                type="text"
                                name="name"
                                value={addGameState.name}
                                onChange={handleChangeAddGameState}
                                placeholder="Enter name of the game"
                            />
                            <input 
                                type="text"
                                name="photo"
                                value={addGameState.photo}
                                onChange={handleChangeAddGameState}
                                placeholder="Enter photo URL of the game"
                            />
                            <Select
                                labelId="demo-simple-select-label-genre"
                                id="demo-simple-select-genre"
                                displayEmpty
                                value={selectedGenre}
                                onChange={handleChangeSelectedGenre}
                                >
                                    <MenuItem value="" disabled>
                                        Genre
                                    </MenuItem>
                                    {genreList.map(genre => <MenuItem key={genre} value={genre}>{genre}</MenuItem>)}
                            </Select>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="date-picker-inline"
                                    label="Release Date"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                            <br/>
                            <Button
                                variant="contained" 
                                color="primary" 
                                onClick={() => addGame(app,addGameData)}>
                                Add Game
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
                            <CardHeader title="Remove Game" /> 
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                displayEmpty
                                value={selectedGame}
                                onChange={handleChangeSelectedGame}
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
                                onClick={() => removeGame(app,selectedGame)}
                            >
                                Remove Game
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
                            <CardHeader title="Add User" /> 
                            <input 
                                type="text"
                                name="user"
                                value={userName}
                                onChange={handleChangeUserName}
                                placeholder="Enter name of the user"
                            />
                            <br/>
                            <Button
                                variant="contained" 
                                color="primary" 
                                onClick={() => addUser(app,userName)}>
                                Add User
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
                            <CardHeader title="Remove User" /> 
                            <Select
                                labelId="demo-simple-select-label-user"
                                id="demo-simple-select-user"
                                displayEmpty
                                value={selectedUser}
                                onChange={handleChangeSelectedUser}
                                >
                                    <MenuItem value="" disabled>
                                        Username
                                    </MenuItem>
                                    {userList.map(user => <MenuItem key={user} value={user}>{user}</MenuItem>)}
                            </Select>
                            <br/>
                            <Button
                                variant="contained" 
                                color="primary" 
                                onClick={() => removeUser(app,selectedUser)}
                            >
                                Remove User
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
                            <CardHeader title="Disable Rating and Comment" /> 
                            <Select
                                labelId="demo-simple-select-label-disable"
                                id="demo-simple-select-disable"
                                displayEmpty
                                value={selectedDisable}
                                onChange={handleChangeSelectedDisable}
                                >
                                    <MenuItem value="" disabled>
                                        Name of the Game
                                    </MenuItem>
                                    {disableGameList.map(game => <MenuItem key={game} value={game}>{game}</MenuItem>)}
                            </Select>
                            <br/>
                            <Button
                                variant="contained" 
                                color="primary" 
                                onClick={() => disableCommentFunc(app,selectedDisable)}
                            >
                                OK
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
                            <CardHeader title="Enable Rating and Comment" /> 
                            <Select
                                labelId="demo-simple-select-label-user"
                                id="demo-simple-select-user"
                                displayEmpty
                                value={selectedEnable}
                                onChange={handleChangeSelectedEnable}
                                >
                                    <MenuItem value="" disabled>
                                        Name of the Game
                                    </MenuItem>
                                    {enableGameList.map(game => <MenuItem key={game} value={game}>{game}</MenuItem>)}
                            </Select>
                            <br/>
                            <Button
                                variant="contained" 
                                color="primary" 
                                onClick={() => enableCommentFunc(app,selectedEnable)}
                            >
                                OK
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
                            <CardHeader title="Login as User" /> 
                            <input 
                                type="text"
                                name="loginUserName"
                                value={loginUserName}
                                onChange={handleChangeLoginUserName}
                                placeholder="Enter the username for login"
                            />
                            <br/>
                            <Button
                                variant="contained" 
                                color="primary" 
                                onClick={() => userCheck(app,loginUserName)}>
                                Log In
                            </Button>
                            {loggedIn && <Redirect to={{pathname:'/user', state:{ currentUserName: loginUserName }}}></Redirect>}
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
                            {goGames && <Redirect to={{pathname:'/games'}}></Redirect>}
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );    
}
export default Homepage;