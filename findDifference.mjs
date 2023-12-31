import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import fetch from "node-fetch";
import fs from "fs";

// Read the stops.txt data and create getTrainTimes mapping
const stopsData = fs.readFileSync("stops.txt", "utf8");
const stopMapping = {};

let mantime = 0;
let bronxtime = 0;
let manCounter = 0;
const EXPRESS = "X";
const LOCAL_SIX = "6";
const NORTH = "N";
const SOUTH = "S";
let timeDifference = 0;
let globalTotalTime = 0;


const lines = stopsData.trim().split("\n").slice(1); // Skip the header
for (const line of lines) {
  const [stopID, , stopName] = line.split(",");
  stopMapping[stopID] = stopName;
}


function getStopNum(stopID)
{
  let stopNum = stopID.substring(1,3);
  if(stopNum.startsWith("0"))
  {
    return stopNum.substring(1,2);
  }
  return stopNum;
}

const formatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true, // Use AM/PM format
};

function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
    return new Intl.DateTimeFormat('en-US', formatOptions).format(date);
  }

  function getCurrentDateTime() {
    const currentDate = new Date();
    return new Intl.DateTimeFormat('en-US', formatOptions).format(currentDate);
  }


export function getTrainTimes(train, direction, stopNum){
  
    (async () => {
      try {
        const response = await fetch("https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs", {
          headers: {
            "x-api-key": "XjxWf3Mih1jAZ4LqD9152TxpYSA29PY997JHqTK5",
          },
        });
        if (!response.ok) {
          const error = new Error(response.url + ": " + response.status + " " + response.statusText);
          error.response = response;
          throw error;
        }
        const buffer = await response.arrayBuffer();
        const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
          new Uint8Array(buffer)
        );
    
        const result = [];
        mantime = 0;
        manCounter = 0;
          globalTotalTime = 0;
        
        
          
          const currentDateTime = getCurrentDateTime();
    
    
        feed.entity.forEach((entity) => {
            if (entity.tripUpdate) {
              const tripUpdate = entity.tripUpdate;
              const tripDescriptor = tripUpdate.trip;
    
              if (tripUpdate.stopTimeUpdate) {
                tripUpdate.stopTimeUpdate.forEach((stopTimeUpdate) => {
    
                  if (tripDescriptor.routeId.startsWith(train) && tripDescriptor.routeId.endsWith(train) && stopTimeUpdate.stopId.endsWith(direction) ) 
                  // && parseInt(getStopNum(stopTimeUpdate.stopId)) <= 21
                  {
                    const formattedStopTimeUpdate = {
                      stopId: stopTimeUpdate.stopId,
                      stopName: stopMapping[stopTimeUpdate.stopId], 
                    };
                    
                    if (stopTimeUpdate.arrival) {
                      formattedStopTimeUpdate.arrival = {
                        time: formatTimestamp(stopTimeUpdate.arrival.time),
                      };
                    }
          
                    if (stopTimeUpdate.departure) {
                      formattedStopTimeUpdate.departure = {
                        time: formatTimestamp(stopTimeUpdate.departure.time),
                      };
                    }
                    if (tripDescriptor.routeId){
                      formattedStopTimeUpdate.routeId = {
                        routeId: tripDescriptor.routeId
                      }
                    }
    
                    //Gets Next Train for 125th
                    if(parseInt(getStopNum(stopTimeUpdate.stopId)) == stopNum){
                      if(stopTimeUpdate.departure.time > Math.floor(new Date().getTime() / 1000) && mantime == 0)
                      {
                      mantime = formatTimestamp(stopTimeUpdate.departure.time);
                      manCounter++;
                      console.log();
                      console.log("125th: Next train: " + formatTimestamp(stopTimeUpdate.departure.time));
                      return;
                      }
                      
                      console.log("125th: " + formatTimestamp(stopTimeUpdate.departure.time));
                      
                    }
    
                    if(manCounter == 1){
                      if(parseInt(getStopNum(stopTimeUpdate.stopId)) == 8){
                        console.log("Reaches Parkchester Train at: " + formatTimestamp(stopTimeUpdate.arrival.time));
                        manCounter++;
    
                        const arrivalTime = new Date(formatTimestamp(stopTimeUpdate.arrival.time));
                        timeDifference = arrivalTime - new Date(mantime);
                        let waitTime = new Date(mantime).getTime() - new Date(currentDateTime).getTime();
                        let totalTime = waitTime + timeDifference;
                        globalTotalTime = totalTime;
                        
    
            
    
                        const diffMinutes = Math.floor(timeDifference / (1000 * 60));
                        const diffSeconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    
                        const totalMinutes = Math.floor(totalTime / (1000 * 60));
                        const totalSeconds = Math.floor((totalTime % (1000 * 60)) / 1000);
    
    
                        console.log(`Time difference: ${diffMinutes} minutes and ${diffSeconds} seconds`);
                        console.log(`Total Time(Includes Waiting Time): ${totalMinutes} minutes and ${totalSeconds} seconds`);
                        
                      
                        console.log();
                      }
                    }
                    result.push(formattedStopTimeUpdate);
                  }
                });
         
              }
            }
          });
          
          // Write the result to getTrainTimes JSON file
          fs.writeFileSync("abstract.json", JSON.stringify(result, null, 2));
          
      
        } catch (error) {
          console.log(error);
          process.exit(1);
        }
      })();
    }

export function getGlobalTotalTimeAsText()
{
  const totalMinutes = Math.floor(globalTotalTime / (1000 * 60));
  const totalSeconds = Math.floor((globalTotalTime % (1000 * 60)) / 1000);
  return totalMinutes +  " minutes and " + totalSeconds + " seconds";
}

export function getGlobalTotalTime()
{
  return globalTotalTime;
}

  
