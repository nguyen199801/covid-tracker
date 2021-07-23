import React, { useEffect, useState } from "react";
import './App.css';
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, printStat } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
  TextField
} from "@material-ui/core";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(['worldwide']);
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80764, lng: -40.4796 });
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);
        });
    };

    getCountriesData();
  }, []);




  const onCountryChange = async (event) => {

    let countryCode = event.target.value;

    if (countries.some(e => e.name === countryCode)) {
      let country = countries.find(e => e.name === countryCode);
      countryCode = country.value;
    }

    if (countries.some(e => e.value === countryCode) || countryCode === 'worldwide') {
      console.log(countryCode);
      const url = countryCode === 'worldwide'
        ? 'https://disease.sh/v3/covid-19/countries'
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

      await fetch(url)
        .then(response => response.json())
        .then(data => {
          if (countryCode === 'worldwide') {
            setMapCountries(data);
            fetch("https://disease.sh/v3/covid-19/all")
              .then((response) => response.json())
              .then((data) => {
                setCountryInfo(data);
              });
            return;
          }

          setCountry(countryCode);
          setCountryInfo(data);
          var country = [];
          country.push(data);
          setMapCountries(country);
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        })
    }
  };





  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>

          <FormControl className="app__searchfield">
            <TextField id="standard-basic" label="Search Country" onChange={onCountryChange} />
          </FormControl>

          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))

              }
            </Select>
          </FormControl>


        </div>

        <div className="app__stats">
          <InfoBox isRed active={casesType === "cases"} onClick={e => setCasesType('cases')} title="Coronavirus cases" cases={printStat(countryInfo.todayCases)} total={countryInfo.cases} />
          <InfoBox active={casesType === "recovered"} onClick={e => setCasesType('recovered')} title="Recovered" cases={printStat(countryInfo.todayRecovered)} total={countryInfo.recovered} />
          <InfoBox isRed active={casesType === "deaths"} onClick={e => setCasesType('deaths')} title="Deaths" cases={printStat(countryInfo.todayDeaths)} total={countryInfo.deaths} />
        </div>

        <Map casesType={casesType} center={mapCenter} countries={mapCountries} />

      </div>

      <Card className="app__right">
        <CardContent>
          <div className="dataTable">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
          </div>

          <div className="lineGraph">
            <h3>Worldwide new {casesType}}</h3>
            <LineGraph casesType={casesType} />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

export default App;
