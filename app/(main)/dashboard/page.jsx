import React from 'react'
import WelcomeContainer from './_component/WelcomeContainer'
// import Dashboard from './page';
import CreateOption from './_component/CreateOption';
import LatestInterviewsList from './_component/LatestInterviewsList';
function Dashboard() {
  return (
    <div>
      {/* <WelcomeContainer/> */}
      <h2 className= '!my-3 font-bold text-2xl'> Dashboard</h2>
      <CreateOption />
      <LatestInterviewsList/>
    </div>
   
  )
}

export default Dashboard
