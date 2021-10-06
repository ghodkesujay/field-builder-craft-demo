import React from "react";
//import "bootstrap/dist/css/bootstrap.min.css"; //for bootstrap elements
import './ListItems.css';

function ListItems(props) {
    const items = props.items;
    
    const listItems = items.map(item => //map function is like for loop
        {
            return <div className="list" key={item.key}> 
                <br/>
                <>{item.text}</>
                <span> 
                    <button type = "submit" className ="delButton" 
                    onClick = { () => props.deleteItem(item.key)

                    }
                    >Delete</button>
                </span>
            </div>
        })
    return(
        <div>{listItems} </div>        
    )
}

export default ListItems;