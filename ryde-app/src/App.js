import './App.css';
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import axios from "axios";
import moment from "moment";

function App() {
  const [data, setData] = useState(null);
  // eslint-disable-next-line
  const [error, setError] = useState(true);
  // eslint-disable-next-line
  const [loading, setLoading] = useState(null);

  // fetches api endpoint data using axios
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`https://dev-backend.rydecarpool.com/coding-challenge/signups?target=dev`);
        console.log(response);
        setData(response.data);
        setError(null);
      }
      catch (err) {
        setError(err.message);
        setData(null);
      }
      finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  // adjusts dates to more readable format (mm/dd)
  // uses the moment library
  const CustomizedAxisTick = ({ x, y, payload }) => {
    const dateTip = moment(payload.value)
      .format("ll")
      .slice(0, 6);
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={23} y={0} dy={14} fontSize="0.90em" fontFamily="bold" textAnchor="end" fill="#fff">
          {dateTip}</text>
      </g>
    );
  }

  // function to customize styling and formatting of the tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    const dateTip = moment(label)
      .format("llll")
      .slice(0, 12);
    const formattedDate = dateTip
    if (payload === null) return
    if (active)
      return (
        <div className="custom-tooltip">
          <p className="label-tooltip">{`${formattedDate}`}</p>
          <p className="desc-tooltip">
            <span className="value-tooltip">Total Signups: {payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      );
    return null;
  };

  // allows user to select range and filter data using a slider
  const xAxisTickFormatter = (timestamp_measured) => {
    return moment(timestamp_measured)
      .format("ll")
      .slice(0, 6);
  }

  return (
    <>
    <h2>Ryde User Signups Per Day 2022</h2>
    <ResponsiveContainer width="90%" aspect={3}>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 20,
          right: 0,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal="true" vertical="" />
        <XAxis dataKey="date" tick={CustomizedAxisTick}/>
        <YAxis dataKey="count"/>
        <Tooltip content={<CustomTooltip />} animationDuration={0} />
        <Legend />
        <Brush tickFormatter={xAxisTickFormatter} dataKey="date" color="gray" />
        <Line type="monotone" dataKey="count" stroke="#8884d8" dot={{ fill: "#2e4355", stroke: "#8884d8", strokeWidth: 2, r: 2 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
    </>
  );
}

export default App;
