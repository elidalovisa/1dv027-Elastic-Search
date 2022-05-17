
import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import base64 from 'base-64'
import utf8 from 'utf8'

const Graph = () => {

    useEffect(() => {
        getData()
    })

    const [data, setData] = useState([])

    // Fetch Data
    const fetchData = async (query) => {
        const credUtf = utf8.encode(process.env.REACT_APP_USERNAME + ':' + process.env.REACT_APP_PASSWORD)
        const credentials = base64.encode(credUtf)
        const response = await fetch(process.env.REACT_APP_BONSAI_URL + query, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Basic ' + credentials,

            },
        })
        const result = await response.json()
        return result
    }


    // Get all provinces
    const getProvinces = async () => {
        const query = '/argentina/_search?size=50&q=*:*&filter_path=hits.hits._source.province'
        const result = await fetchData(query)
        const resultArray = []
        const provinceArray = []
        resultArray.push(result.hits.hits)
        for (let i = 0; i < resultArray[0].length; i++) {
            provinceArray.push(resultArray[0][i]._source.province)
        }
        // console.log(provinceArray)
        //   setProvince(oldArray => [...provinceArray]);
        return provinceArray
    }


    // Get poverty stat
    const getPoverty = async () => {
        const query = '/argentina/_search?size=50&q=*:*&filter_path=hits.hits._source.poverty'
        const result = await fetchData(query)
        const resultArray = []
        const povertyArray = []
        resultArray.push(result.hits.hits)
        for (let i = 0; i < resultArray[0].length; i++) {
           povertyArray.push((parseFloat(resultArray[0][i]._source.poverty)))
        }
        return povertyArray
    }

    // Get poverty stat
    const getBirthMortality = async () => {
        const query = '/argentina/_search?size=50&q=*:*&filter_path=hits.hits._source.birth_mortal'
        const result = await fetchData(query)
        const resultArray = []
        const birthMortalityArray = []
        resultArray.push(result.hits.hits)
        for (let i = 0; i < resultArray[0].length; i++) {
            birthMortalityArray.push((parseFloat(resultArray[0][i]._source.birth_mortal)))
        }
        return birthMortalityArray
    }
    // Code inspiration: https://stackoverflow.com/questions/28165195/how-to-dynamically-add-row-to-google-chart-with-for-loop
    const getData = async () => {
        const province = await getProvinces()
        const poverty = await getPoverty()
        const birthMortality = await getBirthMortality()
        //await getPoverty()
        //await getBirthMortality()
        const dataArray = []
        const columns = ['Province', 'Poverty', 'Birth Mortality']
        dataArray.push(columns)
        console.log(province)
        for (var i = 0; i < province.length; i++) {
            var temp = [];
            temp.push(province[i])
            temp.push(poverty[i])
            temp.push(birthMortality[i])
            dataArray.push(temp);
        }
        setData(dataArray)
        console.log(data) // here its correct in the console

    }

    const data2 = [
        ['Province', 'Poverty', 'Birth Mortality'],
        ['Buenos Aires', 8.167797642491117, 4.4],
        ['Catamarca', 9.234095120444719, 1.5],
        ['Córdoba', 5.3823802695110885, 4.8],
        ['Corrientes', 12.747190658547304, 5.9],
        ['Chaco', 15.8626192230504, 7.5],
        ['Chaco', 15.8626192230504, 7.5],
        ['Chaco', 15.8626192230504, 7.5],
        ['Chaco', 15.8626192230504, 7.5],
        ['Chaco', 15.8626192230504, 7.5],
        ['Chaco', 15.8626192230504, 7.5],
        ['Chaco', 15.8626192230504, 7.5],
        ['Corrientes', 12.747190658547304, 5.9],
        ['Corrientes', 12.747190658547304, 5.9],
        ['Corrientes', 12.747190658547304, 5.9],
    ]

    const options = {
        title: "Population of Largest U.S. Cities",
        chartArea: { width: "50%" },
        hAxis: {
            title: "Total Poverty",
            minValue: 0,
        },
        vAxis: {
            title: "City",
        },
    }

    return (
        <div>
            <Chart
                chartType="BarChart"
                width="100%"
                height="400px"
                data={data}
                options={options}
            />
        </div>
    )
}

export default Graph
