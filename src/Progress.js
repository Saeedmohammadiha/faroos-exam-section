import React, { useEffect, useState } from "react";

const Progress = ({ width }) => {
    const [pWidth, setPWidth] = useState()
    useEffect(() => {
        setPWidth(width)
    }, [width])
    return (
        <div className="progress-div ">
            <div style={{ width: `${pWidth}%` }} className="progress" />
        </div>
    )
}

export default Progress