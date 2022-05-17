
import React, { useState, useEffect, useCallback } from "react";
import { Chart } from "react-google-charts";
import base64 from 'base-64'
import utf8 from 'utf8'
/**
 * Component for collecting and rendering a graphic visualization of data.
 *
 */
const Graph = () => {
    const [data, setData] = useState([])

    /**
     * Makes a fetch request to collect data.
     * @param {string} query - Query for the url.
     * @return {array} - Returns array with data.
     */
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


    /**
     * Makes a fetch request to collect province data.
     * 
     * @return {array} - Returns array with data.
     */
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

    /**
     * Makes a fetch request to collect illiteracy data.
     * 
     * @return {array} - Returns array with data.
     */
    const getIlliteracy = useCallback(async () => {
        const query = '/argentina/_search?size=50&q=*:*&filter_path=hits.hits._source.illiteracy'
        const result = await fetchData(query)
        const resultArray = []
        const gdpArray = []
        resultArray.push(result.hits.hits)
        for (let i = 0; i < resultArray[0].length; i++) {
            gdpArray.push((parseFloat(resultArray[0][i]._source.illiteracy)))
        }
        return gdpArray
    }, [fetchData])

    /**
     * Makes a fetch request to collect poverty data.
     * 
     * @return {array} - Returns array with data.
     */
    const getPoverty = useCallback(async () => {
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

    /**
     * Makes a fetch request to collect birth mortality data.
     * 
     * @return {array} - Returns array with data.
     */
    const getBirthMortality = useCallback(async () => {
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

    /**
     * Fetch all data needed to create the graph.
     * 
     * @see - Loop inspired from: {@link https://stackoverflow.com/questions/28165195/how-to-dynamically-add-row-to-google-chart-with-for-loop }
     * @return {array} - Returns array with data.
     */
    const getData = useCallback(async () => {
        const province = await getProvinces()
        const poverty = await getPoverty()
        const birthMortality = await getBirthMortality()
        const doctorsPerCap = await getIlliteracy()
        const dataArray = []
        const columns = ['Province', 'Poverty', 'Birth Mortality', 'Illiteracy']
        dataArray.push(columns)
        for (var i = 0; i < province.length; i++) {
            var temp = [];
            temp.push(province[i])
            temp.push(poverty[i])
            temp.push(birthMortality[i])
            temp.push(doctorsPerCap[i])
            dataArray.push(temp);
        }
        setData(dataArray)

    }, [getProvinces, getPoverty, getBirthMortality, getIlliteracy])

    const options = {
        title: "Data over Argentinian provinces in %",
        chartArea: { width: "80%" },
        legend: { position: 'top', maxLines: 3 },
        bar: { groupWidth: '75%' },
        isStacked: true,
        hAxis: {
            title: "Province",
            minValue: 0,
        },
        vAxis: {
            title: "Total amount of data",

        },
        backgroundColor: '#E4E4E4',

    }

    useEffect(() => {
        getData()
    }, [getData])


    return (
        <div>
            <Chart
                chartType="ColumnChart"
                width="700px"
                height="700px"
                data={data}
                options={options}
            />
        </div>
    )
}

export default Graph
