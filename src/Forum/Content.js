import React from "react";
import "./App.css";
import comment from"./comment.png";
import likes from "./heart.png";
import views from "./views.png";
import scrolable from './Scrollable';


class ContentCard extends React.Component {

    render() {
        return (
         
 
    <div style={{"display": "flex", "flex-direction": "row", "height":"1000px",  "backgroundColor":"##F4ECF7",
    "align-items": "center", "font-family": "Avant Garde", "padding":"20px", "boxShadow": "0px 2px 2px 0px #D1F2EB"}}>
 
                <div style={{"display": "flex", "flex-direction": "colmun", "height":"60px",  "backgroundColor":"#E8F8F5",
                     "align-items": "center", "font-family": "Avant Garde", "width":"650px"}}>
                    <h3> Learning to think like a philosopher while sharpening  critical-thinking skills       </h3>



                </div>

                <div style={{"display": "flex", "flex-direction": "row", "height":"60px",  "backgroundColor":"#E8F8F5",
                     "align-items": "center", "font-family": "Avant Garde", "width":"650px","justify-content": "space-between", 
                     "padding":"10px", "border":"10px"}}> 
                        <div>
                            <h4> <img style={{"height":"15px","width":"15px"}}  src={comment}></img> 100       </h4>
                        </div>
           

                        <div>
                        <h4> <img style={{"height":"15px","width":"15px"}}  src={likes}></img> 370       </h4>
                        </div>
                        
                        <div>
                        <h4> <img style={{"height":"15px","width":"15px"}}  src={views}></img> 1032       </h4>
                        </div>
                        



                        <div>
                        <h4> 7d       </h4> 
                        </div>


                </div>








    



     
     </div>
)
}
}
export default ContentCard;