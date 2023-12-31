import { getTrainTimes, getGlobalTotalTime, getGlobalTotalTimeAsText, getTrainRunning } from './findDifference.mjs';
import * as stops from "./trainStops.js";
import { SIX_LOCAL, SIX_EXPRESS, NORTH } from './constants.js';


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function main() {

  console.log("LOCAL");
  getTrainTimes(SIX_LOCAL, NORTH, stops.M125.number);
  await sleep(2000);

  console.log(getGlobalTotalTime());
  const local = getGlobalTotalTime();

  console.log(getGlobalTotalTimeAsText());
  const localAsText = getGlobalTotalTimeAsText();

  console.log();



  console.log("EXPRESS");
  getTrainTimes(SIX_EXPRESS, NORTH, stops.M125.number);
  await sleep(2000);

  console.log(getGlobalTotalTime());
  const express = getGlobalTotalTime();

  console.log(getGlobalTotalTimeAsText());
  const expressAsText = getGlobalTotalTimeAsText();
  
  let expressMessage = "";
  let localMessage = "";
  if(!getTrainRunning(SIX_EXPRESS))
  {
    expressMessage = "Express Train is not Running";
  } else{
    expressMessage = "Express time: " + expressAsText;
  }

  if(!getTrainRunning(SIX_LOCAL))
  {
    localMessage = "Local Train is not Running";
  } else{
    localMessage = "Local time: " + localAsText;
  }


  if((local > express))
  {
    if(getTrainRunning(SIX_EXPRESS))
    {
      console.log();
      console.log("The express gets you to Parkchester faster"); 
      
      console.log();
  
      console.log(expressMessage);
      console.log(localMessage);
      return { 
        message: 'The express gets you to Parkchester faster',
        expressTime: expressMessage,
        localTime: localMessage
    };
    }else{
      console.log();
      console.log("The local gets you to Parkchester faster"); 
      
      console.log();
  
      console.log(expressMessage);
      console.log(localMessage);
      return { 
        message: 'The local gets you to Parkchester faster',
        expressTime: expressMessage,
        localTime: localMessage
      }
    } 
  } else{
      if(getTrainRunning(SIX_EXPRESS))
      {
      console.log();
      console.log("The local gets you to Parkchester faster");
      console.log();

      console.log(expressMessage);
      console.log(localMessage);
      return { 
        message: 'The local gets you to Parkchester faster',
        expressTime: expressMessage,
        localTime: localMessage,
        };
      } else{
        console.log();
        console.log("The Express gets you to Parkchester faster");
        console.log();

        console.log(expressMessage);
        console.log(localMessage);
        return { 
          message: 'The Express gets you to Parkchester faster',
          expressTime: expressMessage,
          localTime: localMessage,
          };
      }

  }
}

main(); 