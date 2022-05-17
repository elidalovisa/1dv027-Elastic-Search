
import React, { useState, useEffect, useCallback } from "react";
import { Chart } from "react-google-charts";
import base64 from 'base-64'
import utf8 from 'utf8'

const Graph = () => {

    const [data, setData] = useState([])

    // Fetch Data
    const fetchData = useCallback(async (query) => {
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
    }, [])


    // Get all provinces
    const getProvinces = useCallback(async () => {
        const query = '/argentina/_search?size=50&q=*:*&filter_path=hits.hits._source.province'
        const result = await fetchData(query)
        const resultArray = []
        const provinceArray = []
        resultArray.push(result.hits.hits)
        for (let i = 0; i < resultArray[0].length; i++) {
            provinceArray.push(resultArray[0][i]._source.province)
        }
        return provinceArray
    }, [fetchData])


    // Get poverty stat
    const getPoverty = useCallback( async () => {
        const query = '/argentina/_search?size=50&q=*:*&filter_path=hits.hits._source.poverty'
        const result = await fetchData(query)
        const resultArray = []
        const povertyArray = []
        resultArray.push(result.hits.hits)
        for (let i = 0; i < resultArray[0].length; i++) {
           povertyArray.push((parseFloat(resultArray[0][i]._source.poverty)))
        }
        return povertyArray
    }, [fetchData])

    // Get birh mortality stat
    const getBirthMortality = useCallback( async () => {
        const query = '/argentina/_search?size=50&q=*:*&filter_path=hits.hits._source.birth_mortal'
        const result = await fetchData(query)
        const resultArray = []
        const birthMortalityArray = []
        resultArray.push(result.hits.hits)
        for (let i = 0; i < resultArray[0].length; i++) {
            birthMortalityArray.push((parseFloat(resultArray[0][i]._source.birth_mortal)))
        }
        return birthMortalityArray
    }, [fetchData])

    // Code inspiration: https://stackoverflow.com/questions/28165195/how-to-dynamically-add-row-to-google-chart-with-for-loop
    const getData = useCallback(async () => {
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

    }, [getProvinces, getPoverty, getBirthMortality])


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
    
    useEffect(() => {
        getData()
    },[getData])


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
