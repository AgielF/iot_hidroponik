import React from 'react'
import { TopBar } from "./TopBar";
import { Grid} from "./Grid";
import Tabs from './Tabs'

function Dashboard() {
  return (
    <div className="bg-white rounded-lg pb-4 shadow">

      <TopBar />
      <div></div>
      <Tabs
      arguments_1="DHT22"
      arguments_2="PH"
      arguments_3="Sensor EC"
      arguments_4="Sensor cahaya"
      />
      <Grid />
      
    </div>
  )
}

export default Dashboard
