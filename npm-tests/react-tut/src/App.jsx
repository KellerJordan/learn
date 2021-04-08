import React, { Component } from "react";
import "./App.css";
import MyCanvas from "./MyCanvas";


class Clock extends Component {
    constructor(props) {
        super(props);
        this.state = {date: new Date(), date0: performance.now()};
    }
    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState({
                date: new Date(),
                date0: performance.now()
            });
        }, 1);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    render() {
        //var timeStr = this.state.date.toLocaleDateString();
        var timeStr = this.state.date0.toLocaleString();
        return (
            <div>
                <h1>I am clock</h1>
                <h2>It is {timeStr}</h2>
            </div>
        );
    }
}

class App extends Component {
    render() {
        return (
            <div className="App">
                <h1>Hello, World!</h1>
                <img src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg"/>
                <Clock/>
                <MyCanvas/>
            </div>
        );
    }
}

export default App;
