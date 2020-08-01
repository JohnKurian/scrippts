import React, { Component } from 'react';
import "./App.css";
import Popup from 'react-popup';
import Modal from 'react-awesome-modal';

class HoverMe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible : false
        }
    }

    openModal() {
        this.setState({
            visible : true
        });
    }

    closeModal() {
        this.setState({
            visible : false
        });
    }

    render() {
        return (
            <section>
                
                <input type="button" className="button-none" value="Open" onClick={() => this.openModal()} />
                <Modal visible={this.state.visible} width="400" height="290" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div>
                        <h1>Comments</h1>

                        <div style={{"display": "flex", "flex-direction": "column", "height":"60px",  "backgroundColor":"white",
                         "font-family": "Avant Garde", "width":"380px", 
                     "padding":"1px", "border":"1px", "position":"auto"}}>
                            <div style={{"boxShadow": "0px 2px 2px 0px #D1F2EB"}}>
                                <h4> DjDebbie, 3 minutes ago</h4>
                                <h3>Yes, This argument maps is amazing!</h3>
                            </div>

                            <div style={{"boxShadow": "0px 2px 2px 0px #D1F2EB"}}>
                                <h4> JOhnDoe,  1 hour ago</h4>
                                <h3>Could i be any more smart :)</h3>
                            </div>

                            <div style={{"boxShadow": "0px 2px 2px 0px #D1F2EB"}}>
                                <h4> AvinashBoss, 7 days ago</h4>
                                <h3>My back hurts reading this.</h3>
                            </div>

                            <div style={{"height":"20px","width":"200px" , "border":"none"}}>
                                <input type="text"    ref={(c) => this.title = c} name="title" />
                                
                                    <button className="button-none"> Post </button>
                                
                            </div>
                            <br></br>
                            <a href="javascript:void(0);" onClick={() => this.closeModal()}>Close</a>




                        </div>
                        







                        
                    </div>
                </Modal>
            </section>
        );
    }
};
  

export default HoverMe;