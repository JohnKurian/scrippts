import React from "react";
import "./App.css";

class scrolable extends React.Component {
    constructor(props) {
      super(props)
      this.myRef = React.createRef()
      this.state = {scrollTop: 0}
    }
  
    onScroll = () => {
      const scrollY = window.scrollY //Don't get confused by what's scrolling - It's not the window
      const scrollTop = this.myRef.current.scrollTop
      console.log(`onScroll, window.scrollY: ${scrollY} myRef.scrollTop: ${scrollTop}`)
      this.setState({
        scrollTop: scrollTop
      })
    }
  
    render() {
      const {
        scrollTop
      } = this.state
      return (
        <div
          ref={this.myRef}
          onScroll={this.onScroll}
          style={{
            border: '1px solid black',
            width: '600px',
            height: '100px',
            overflow: 'scroll',
          }} >
          <p>This demonstrates how to get the scrollTop position within a scrollable react component.</p>
          <p>ScrollTop is {scrollTop}</p>
          <p>This demonstrates how to get the scrollTop position within a scrollable react component.</p>
          <p>ScrollTop is {scrollTop}</p>
          <p>This demonstrates how to get the scrollTop position within a scrollable react component.</p>
          <p>ScrollTop is {scrollTop}</p>
          <p>This demonstrates how to get the scrollTop position within a scrollable react component.</p>
          <p>ScrollTop is {scrollTop}</p>
          <p>This demonstrates how to get the scrollTop position within a scrollable react component.</p>
          <p>ScrollTop is {scrollTop}</p>
          <p>This demonstrates how to get the scrollTop position within a scrollable react component.</p>
          <p>ScrollTop is {scrollTop}</p>
        </div>
      )
    }
  }

  export default scrolable;