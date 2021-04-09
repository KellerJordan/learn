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

function Example() {
    const [count, setCount] = React.useState(0);
    console.log(`Example() called, count=${count}`);
    globalThis.setCount = setCount;
    return (
        <div>
            <button onClick={() => setCount(count+1)}>click me</button>
            <div>fake count</div>
            <SubExample/>
        </div>
    );
}

function SubExample() {
    const [myCount, mySetCount] = React.useState(5);
    console.log(`MyExample() called, count=${myCount}`);
    globalThis.mySetCount = mySetCount;
    return (
        <div>
            sub example
        </div>
    );
}

class App extends Component {
    render() {
        console.log("App.render() called");
        return (
            <div className="App">
                <h1>Hello, World!</h1>
                <img src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg"/>
                <Example/>
            </div>
        );
    }
}

globalThis.thingy = React.Fragment;
console.log(React.Fragment);

export default App;
