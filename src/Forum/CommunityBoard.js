import React from "react";
import "./App.css";

class CommunityBoard extends React.Component {

    render() {
        return (
         
 
    <div style={{"display": "flex", "flex-direction": "row", "height":"1000px",  "backgroundColor":"#D1F2EB",
    "align-items": "center", "font-family": "Avant Garde"}}>
 
                <div style={{"display": "flex", "flex-direction": "colmun", "height":"40px",  "backgroundColor":"#D1F2EB",
                     "align-items": "center", "font-family": "Avant Garde", "width":"600px"}}>
                    <h2> Topics       </h2>



                </div>

                <div style={{"display": "flex", "flex-direction": "row", "height":"40px",  "backgroundColor":"#D1F2EB",
                     "align-items": "center", "font-family": "Avant Garde", "width":"600px","justify-content": "space-between", 
                     "padding":"10px", "border":"10px"}}> 
                        <div>
                            <h4> Comments       </h4>
                        </div>
           

                        <div>
                            <h4> Likes       </h4>
                        </div>
                        
                        <div>
                            <h4> Views       </h4>
                        </div>
                        



                        <div>
                        <h4> Posted       </h4> 
                        </div>


                </div>








    



     
     </div>
)
}
}
export default CommunityBoard;