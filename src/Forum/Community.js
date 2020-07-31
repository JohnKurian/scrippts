import React from "react";
import "./App.css";
import { Button } from "antd";
import Search from "./search.png";
import CommunityBoard from "./CommunityBoard";
import star from "./star.png";
import ContentCard from "./Content";
import scrolable from './Scrollable';


class CommunityPage extends React.Component {



    componentDidMount() {
        document.body.style.backgroundColor = "#76D7C4"
        // this.getCampaigns()   
    }
    render() {
        return (
         
            <div style={{"font-color":"white","display": "flex", "flex-direction": "column",
            "align-items": "center", "margin-top":"20px", "font-family":"Georgia"}}> 
                <h1>Community Forum</h1>
                <h3>Support your community and find out the most interesting argument trees!</h3>



                <div style={{"backgroundColor":"white", color:"black",fontSize: "16px","border-radius": "12px",
                display: "inline-block", width: "1000px",height: "1200px",padding: "10px",top:"0",left: "0"}}>


                                    <div style={{"display": "flex", "flex-direction": "row","backgroundColor":"#A3E4D7", 
                                    "color":"black","fontSize": "14px","padding-top":"5px", "border-radius": "10px","height":"40px",  "font-family": "Avant Garde"}}>
                                    <h2> All-Discussions</h2>
                                                <div style={{"display": "flex", "flex-direction": "column", "alignItems":"center"}}>
                                                    <button className="btn-custom">
                                                        
                                                    <img style={{"height":"25px","width":"25px", "vertical-align":"top", "display": "flex", 
                                                    "flex-direction": "row", "margin-bottom":"15px"}}   src={Search}></img>         
                                                                                                       Search the community... </button>

                                                </div>

                                                

                                    </div>



                    



                                      <div style={{"display": "flex", "flex-direction": "row","backgroundColor":"#E8F8F5", "margin":"10px",
                                    "color":"black","fontSize": "14px","height":"1000px",  "font-family": "Avant Garde"}}>
                                    
                                                

                                                <div style={{"display": "flex", "flex-direction": "column","backgroundColor":"#D1F2EB", 
                                                "color":"black","fontSize": "14px","height":"30px","width":"100%" , "font-family": "Avant Garde"}}>
                                                <h4> Latest     |          New     |        Starred     <img style={{"height":"15px","width":"15px"}}  src={star}></img>        </h4>
                                
                                            
                                                          
                                                <CommunityBoard/> 
                                                <scrolable/>
                                                <ContentCard/><ContentCard/><ContentCard/><ContentCard/><ContentCard/><ContentCard/><ContentCard/>
                                                {/* <ContentCard/><ContentCard/><ContentCard/><ContentCard/><ContentCard/><ContentCard/><ContentCard/> */}
                
                                                 
                                                
                                                            

                                                </div>


                                                
                                                

                                      </div>









                                    <div>
                                                <h2>Create your very own and start sharing to your community.</h2>
                                                <h4>Your feedback would be very helpful</h4>


                                                
                                    </div>


                     </div>

                

            </div>

            )
    }
}
export default CommunityPage;