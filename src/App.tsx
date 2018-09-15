import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as React from 'react';
import * as request from 'request';
import './App.css';



interface IDotaHero {
  attack_type: string,
  id: number,
  legs: number,
  localized_name: string,
  name: string,
  primary_attr: string,
  roles: string[]
}

interface IState {
  apiValue: any,
  inputString: any,
  searchedVal: any,
  searchedHero: IDotaHero | undefined,
  errorState: boolean,
  searchingState: boolean,
  heroImg: string
}

// Created kind-of enums to change the output, as API gives agi,str,int.
const attributeEnum = {
  "agi": "Agility",
  "int": "Intelligence",
  "str": "Strength"
}

export default class App extends React.Component<{},IState> {

  private apiEndpoint: string;
  private heroList: IDotaHero[];

  constructor(props: any){
    super(props);
    this.state = {
      apiValue: 0,
      errorState: false,
      heroImg: '',
      inputString: '',
      searchedHero: undefined,
      searchedVal: '',
      searchingState: false,
    }
    this.whenEntered = this.whenEntered.bind(this);
    this.whenClicked = this.whenClicked.bind(this);
    // api call.
    this.apiEndpoint = "https://api.opendota.com/api/heroes";
  }

  // Start getting info from the API before the webpage fully loads
  // Called the first time the component is loaded right before the component is added to the page
  public componentWillMount() {
    request.get(this.apiEndpoint, (error , response) => {
      if(error) {
        // tslint:disable-next-line:no-console
        console.error(error);
        return;
      }
      // Stores API info into the HeroList array.
      this.heroList = JSON.parse(response.body);
    });
  }

  // When the button is clicked
  public whenClicked() {
    this.setState(
      // This puts the input string into the searched field. 
      
      { searchedVal: this.state.inputString,
      searchingState: true } , () => {
        // For loop that runs and check if the input name is the same as a name in the cache. 
      for (const key in this.heroList) {
        // When this ensures that the user must enter the right name. 
        if(this.heroList[key].localized_name.toLowerCase()===this.state.searchedVal.toLowerCase()) {
          const imgName = this.heroList[key].localized_name.toLowerCase().replace(" ", "_").replace("-","").replace("necrophos", "necrolyte");
          this.setState({
            heroImg: "http://cdn.dota2.com/apps/dota2/images/heroes/"+imgName+"_full.png",
            searchedHero: this.heroList[key],
          });
          this.setState({errorState: false});
          break;
        } else {
          this.setState({errorState: true});
        }
      }

      setTimeout(() => {
        this.setState({searchingState: false});
      }, 1000);

    });
  }

  // When the user types in the search bar
  public whenEntered(event: { target: { value: any;};}){
    this.setState(
      {inputString : event.target.value}
    );
  }
  
  // Gets called everytime a state is changed. 
  public render() {

    if (this.state.searchingState) {
       return(
         <div className="loader">  
           <CircularProgress thickness={3} />
         </div>
       );
    }

    return (
      <div className="container-fluid">

      <div className="centreText">
        <h1>Enter a Dota Hero name:</h1>
      </div>

      <div className="searchBar" >
          <input id="searchBar" type="text" value={this.state.inputString} onChange={this.whenEntered}/>
      </div>

      <div className="searchButton">
          {/* <button id="searchButton" onClick={this.whenClicked}> Search </button> */}
          <Button variant="contained" color="primary" onClick={this.whenClicked}>
        Search
      </Button>
      </div>

      <div className="output"> 
        {this.printHero()}
      </div>


    </div>
    );
  }


  private printHero() {
    if (this.state.errorState) {
      return (
        <div id="errorText">
          <label >Sorry, Hero entered does not exist.</label>
        </div>);
    }
    
    if (this.state.searchedHero !== undefined) {

      const primaryAttribute = attributeEnum[this.state.searchedHero.primary_attr];
      return (
        <div>
            <img src={this.state.heroImg} />
            <h1>{this.state.searchedHero.localized_name} Stats: </h1>
            <label> Primary Attribute: {primaryAttribute} </label>
            <br/>
            <label> Attack Type: {this.state.searchedHero.attack_type} </label> 
            <br/>
            <label> Roles: {this.state.searchedHero.roles.join(", ")}</label>
            <br/>
            <label> Legs: {this.state.searchedHero.legs} </label>
        </div>);

        // This allows for the searching state to work. 
        
    } 
    return null;
  }
}
