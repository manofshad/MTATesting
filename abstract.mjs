import { getTrainTimes, getGlobalTotalTime, getGlobalTotalTimeAsText } from './findDifference.mjs';
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




  if(local > express){
    console.log();
    console.log("The express gets you to Parkchester faster"); 
    
    console.log();

    console.log("Express time: " + expressAsText);
    console.log("Local time:" + localAsText);
    return { 
      message: 'The express gets you to Parkchester faster',
      expressTime: "Express time: " + expressAsText,
      localTime: "Local time:" + localAsText,
  
  };
  } else{
    console.log();
    console.log("The local gets you to Parkchester faster");
    console.log();

    console.log("Express time: " + expressAsText);
    console.log("Local time:" + localAsText);
    return { 
      message: 'The local gets you to Parkchester faster',
      expressTime: "Express time: " + expressAsText,
      localTime: "Local time:" + localAsText,
  
  };
    
  }
}

main(); 