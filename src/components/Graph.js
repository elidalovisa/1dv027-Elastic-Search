
import React, { useEffect } from "react";
import { Chart } from "react-google-charts";
import base64 from 'base-64'
import utf8 from 'utf8'

const Graph = () => {
    const data = []
  useEffect(() => {
        getData()
    })

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
    const province = []

    const resultArray = []
    resultArray.push(result.hits.hits)
    for (let i = 0; i < resultArray[0].length; i++) {
        province.push(resultArray[0][i]._source.province)
    }
    return province
}

// Get poverty stat
const getPoverty = async () => {
    const query = '/argentina/_search?size=50&q=*:*&filter_path=hits.hits._source.poverty'
    const result = await fetchData(query)
    const resultArray = []
    const poverty = []
    resultArray.push(result.hits.hits)
    for (let i = 0; i < resultArray[0].length; i++) {
        poverty.push(parseFloat(resultArray[0][i]._source.poverty))
    }
    return poverty
}

// Get poverty stat
const getBirthMortality = async () => {
    const query = '/argentina/_search?size=50&q=*:*&filter_path=hits.hits._source.birth_mortal'
    const result = await fetchData(query)
    const resultArray = []
    const birthMortality = []
    resultArray.push(result.hits.hits)
    for (let i = 0; i < resultArray[0].length; i++) {
        birthMortality.push(parseFloat(resultArray[0][i]._source.birth_mortal))
    }
    return birthMortality
}
// Code inspiration: https://stackoverflow.com/questions/28165195/how-to-dynamically-add-row-to-google-chart-with-for-loop
const getData = async () => {
    const provinceData = await getProvinces()
    const povertyData = await getPoverty()
    const birthMortalityData = await getBirthMortality()
    const header = ['Province', 'Poverty', 'Birth Mortality']
    data.push(header)

    for (var i = 0; i < provinceData.length; i++) {
        var temp = [];
        temp.push(provinceData[i])
        temp.push(povertyData[i])
        temp.push(birthMortalityData[i])
        data.push(temp);
    }
}
const testData = data
console.log(testData)
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
  };

return (
    <div>
{console.log(data)}
        <Chart
            chartType="BarChart"
            width="100%"
            height="400px"
            data={data2}
            options={options}
        />
          <div>
    </div>
    </div>
)
}

export default Graph
