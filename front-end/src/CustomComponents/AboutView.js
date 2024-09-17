import React from "react";

class AboutView extends React.Component{

    render(){
        return(
        <div className="card" 
             style={{margin:"10px"}}>
            <div className="card-body">
                <h5 className="card-title">About us</h5>
                <p className="card-text">This is a website built to store notes.</p>
                <p className="card-text">Go to Stored to se your stored notes</p>
                <p className="card-text">Go to Search to searh notes from others and see them.</p>
                <p className="card-text">Go to My Notes to see your own notes .</p>

            </div>
        </div>
        )
    }
}

export default AboutView