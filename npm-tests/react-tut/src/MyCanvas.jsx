import React from "react";
import "./MyCanvas.css";

class InnerCustom extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>{"m"+"e".repeat(this.props.count)}</div>
        );
    }
}

const InnerCustom2 = props => {
    return (
        <div>{"m"+"e".repeat(props.count)}</div>
    );
};

const MyCanvas = () => {
    const myRef = React.createRef();

    const [count, setCount] = React.useState(3);

    setTimeout(() => {
        const gl = myRef.current.getContext("webgl");
        gl.clearColor(0.0, 1.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    });
    setTimeout(() => {
        setCount(10);
    }, 800);
    return (
        <>
            <canvas ref={myRef} className="MyCanvas" width="800px" height="400px">
            </canvas>
            {"zzz"+"e".repeat(count)}
            <InnerCustom count={count}/>
            <InnerCustom2 count={count}/>
        </>
    );
}

export default MyCanvas;
