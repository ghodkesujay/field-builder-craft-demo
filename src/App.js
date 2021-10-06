import React, { Component } from "react"; 
import { useState } from "react";
//import "bootstrap/dist/css/bootstrap.min.css"; //for bootstrap elements
import { useForm } from 'react-hook-form'; //react hook form validations
import { yupResolver } from '@hookform/resolvers/yup'; //yup resolver
import * as Yup from 'yup'; //everything from yup schema validation library for form validation rules
import logo from './logo.svg';
import './App.css';
import ListItems from "./ListItems";
import FieldService from "./MockService";
import { boolean } from "yup/lib/locale";
import PostService from "./PostService";

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      label:'',
      required:'',
      items:[],
      currentItem:{
        text: '',
        key:''
      },
      defaultItem:{
        text: '',
        key:''
      },

      defaultFlag: false,
      selectedSort:'',

      sortOptions:["Display choices in Alphabetical Order"]
    }
    this.handleInput = this.handleInput.bind(this); //to keep context of the handleInput method, binding it here
    this.addItem = this.addItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this); //same reason for binding each method
    this.onChange = this.onChange.bind(this);
    this.onChangeBool = this.onChangeBool.bind(this);
    this.handleDefault = this.handleDefault.bind(this); 
    this.checkIfContains = this.checkIfContains.bind(this);
    this.handleDefaultSubmit = this.handleDefaultSubmit.bind(this);
    this.onChangeChecked = this.onChangeChecked.bind(this);
  }

  handleInput(e) {
    this.setState({
      currentItem:{
        text: e.target.value,
        key: Date.now() //setting timestamp as key to avoid duplicacy
      }
    })
  }

  handleDefault(e) {
    console.log("Handle default called");
    // e.preventDefault(); //this will stop that behavior
    this.setState({
      defaultItem:{
        text: e.target.value,
        key: Date.now() //setting timestamp as key to avoid duplicacy
      }
    })
    
  }

  handleDefaultSubmit(e){
    e.preventDefault();
    console.log("Default item is:",this.state.defaultItem)
    if(!this.checkIfContains(this.state.defaultItem)){
      this.state.defaultFlag = true;
      console.log("Default target value", this.state.defaultItem.text);
      this.addItem(this.state.defaultItem);
    }

    console.log("Handle Default State:",this.state);
    this.onChangeBool(e);

  }

  addItem(e) { //default behavior is clicking button would refresh the page
    let newItem;
    if(!this.state.defaultFlag){
      e.preventDefault(); //this will stop that behavior
      newItem = this.state.currentItem;
    }
    else{
      newItem = this.state.defaultItem;
    }
    console.log("AddItem new item inserted:", newItem);
    if( newItem.text !== "" && !this.checkIfContains(newItem) && this.state.items.length < 50) {
      console.log("Entered here");
      const newItems = [...this.state.items, newItem];
      console.log("New Items is:", newItems, this.state.items);
      if(this.state.defaultFlag){
        this.setState({ items:newItems }, function () { console.log("Immediately after setting state: ", this.state.items)
          PostService(this.state).then(response => {
          console.log(response);
          alert("Provided choices are submitted");
        })
      });
      }
      else{
        this.setState({
          items:newItems 
          // currentItem: {
          //   text: "",
          //   key:''
          // }
        });
      }
      
      console.log("After adding:", this.state.items);
    }
    
  }

  checkIfContains(newItem){
    console.log("Items is:" + [...this.state.items]);
    console.log("Current item", this.state.currentItem);
    for( let temp in this.state.items){
      console.log("Temp is:" + this.state.items[temp].text);
      if(this.state.items[temp].text === newItem.text){
        return true;
      }
    }
    return false;
  }

  deleteItem(key) {
    const filteredItems = this.state.items.filter( item =>
      item.key !== key); //will filter items on whose name is not a match
      this.setState({
        items:filteredItems
      });
  }
  
  onChange(e) { //picking up label value
    this.setState({
        label: e.target.value
    });
    //console.log(this.state)
  }

  onChangeChecked(e) {
    this.setState({
      required: "true"
    })
  }

  onChangeBool(e) { //picking up boolean value from required field
    if(this.state.required !== "true") {
      this.setState({
        required: "false"
      });
    }
    //console.log(this.state)
  }


  // componentDidMount() {
  //   // Simple POST request with a JSON body using fetch
  //   const requestOptions = {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ title: 'React POST Request Example' })
  //   };
  //   fetch('https://reqres.in/api/posts', requestOptions)
  //       .then(response => response.json())
  //       .then(data => this.setState({ postId: data.id }));
  // }

  render() {

    return(
      <div className = "App">
        <header> 
          <form id = "fieldForm"  onSubmit={FieldService.saveField(this.state.items)}> 
            <h1>Field Builder</h1> <br/>
            
            <>Label: </>
            <input onChange={this.onChange} required type = "text" placeholder = "Sales Region" />
            <br/>
            <br/>

            <>Type:  Multi-select  </>
            <input type = "checkbox" onChange={this.onChangeChecked} required placeholder = "A value is required" />
            <> A value is required</>
            <br/>
            <br/>

            <>Default value: </>
            <input type = "text" id = "defaultValue" placeholder = "Enter default value" 
            value = {this.state.defaultItem.text} //linking the currentItem declared in constructor to this input
            onChange = {this.handleDefault} //calling handleInput method onChange
             />
            {/* <select> 
              {this.state.items.map( data =>
                (
                  <option>{data.text}</option>
                )
                )}
            </select> */}
            <br/>
            <br/>

            <>Add to choices: </>
            <input type = "text" placeholder = "Enter choice" 
            value = {this.state.currentItem.text} //linking the currentItem declared in constructor to this input
            onChange = {this.handleInput} //calling handleInput method onChange
            />
            
            <button type = "button" onClick = {this.addItem} >Add</button>
            <br/>
            <br/>
            <ListItems items = {this.state.items} deleteItem = {this.deleteItem}> </ListItems> 
            <br/>
            <>Order: </>
            <select>
              {this.state.sortOptions.map( sort =>
                (
                  <option>{sort} </option>
                ))}
            </select>
            <br/>
            <br/>
          
            <button type = "submit" value = {this.state.defaultItem.text} 
                onClick = { this.handleDefaultSubmit }
              >Save changes</button> Or <button type = "button">Cancel</button>

          </form>
        </header>

        

      </div>
    );// ListItems tag will fetch files from ListItems.js file
  }
}
export default App;
