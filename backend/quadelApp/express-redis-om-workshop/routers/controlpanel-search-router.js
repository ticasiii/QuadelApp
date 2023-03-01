import { Router } from 'express'
import { controlPanelRepository } from '../om/controlpanel.js'
import { quadelGraph } from "../om/quadelGraph.js"
import { stateEnum } from "../om/stateEnum.js"
import { generate_data } from "../om/generate_data.js";
import { deleteAllKeys } from '../om/generate_data.js'
import client from '../om/client.js'

import { createClient,TimeSeriesAggregationType  } from 'redis';
const clientTimeSeries = createClient();
clientTimeSeries.connect();



export const router = Router()

router.get('/all', async (req, res) => {
 /*   const controlPanels = await controlPanelRepository.search().return.all()
    res.send(controlPanels)
*/
    const controlpanelsFromGraph = (await quadelGraph.query(
      "MATCH (cp:ControlPanel) return ID(cp) as ID, cp.title as title, cp.description as description, cp.state as state, cp.type as type",

    ))
    console.table(controlpanelsFromGraph.data);
    //OBRATITI PAZNJU NA FORMAT U KOM VRATI NIZ CONTROL PANELA
    res.send(controlpanelsFromGraph.data)
})

//za text polja MATCHES (ako uospte sadrzi parametar )
router.get('/by-ChainNumber/:chainNumber', async (req, res) => {
    const chainNumber = req.params.chainNumber
    const controlPanels = await controlPanelRepository.search()
      .where('chainNumber').matches(chainNumber).return.all()
    res.send(controlPanels)
  })

  //GET ALL NODES WITH SAME CHAIN NUMBER IN RELATIONSHIP PROPERTY
router.get('/allFromSameChain/:chainNumber', async (req, res) => {

  const chainedElementsNodeInGraph = (await quadelGraph.query(
    "MATCH (e:Element)-[r:IS_CONNECTED_ON {chainID:$chainNumber} ]->(cp:ControlPanel) return e,cp",
    {
      params:{
        chainNumber: Number(req.params.chainNumber),
      }
    }
  ))
  console.log(req.params.chainNumber+" chain Number")
  console.table(chainedElementsNodeInGraph.data);
  res.send(chainedElementsNodeInGraph.data)
  
})

//GET CONTROL PANELS AFTER CHANGING STATE
router.get('/getControlPanelsWithAlarm/', async (req, res) => {

  const controlpanelsWithAlarm = (await quadelGraph.query("MATCH (e:Element)-[r:IS_CONNECTED_ON]->(cp:ControlPanel) WHERE e.state = 4 SET cp.state = 4 RETURN ID(cp) as ID, cp.title as title, cp.description as description, cp.state as state, cp.type as type "))

  console.table(controlpanelsWithAlarm.data);
  res.send(controlpanelsWithAlarm.data)
  
})



 //GET ALL CONTROL PANELS FROM PICTURE
 router.get('/allFromSamePicture/:pictureId', async (req, res) => {
  const elementsFromGraph = (await quadelGraph.query(
    "OPTIONAL MATCH (cp:ControlPanel)-[r:IS_IN]->(p:Picture) WHERE ID(p) = $pictureId RETURN ID(cp) as ID, cp.title as title, cp.description as description, cp.state as state, cp.type as type ORDER BY cp.title",
    {
      params:{
        pictureId: req.params.pictureId
      }
    }
  ))

  console.table(elementsFromGraph.data);
  res.send(elementsFromGraph.data)
})

//za stringove equals (string u potpunosti jednak po karakterima)
/*  router.get('/by-PictureId/:pictureId', async (req, res) => {
    const pictureId = req.params.pictureId
    const controlPanels = await controlPanelRepository.search()
      .where('pictureId').equals(pictureId).return.all()
    res.send(controlPanels)
  })*/
//      "MATCH (cp:ControlPanel) WHERE cp.pictureId = $pictureId RETURN cp { .title, .description, .state, .pictureId, .type} as cp",

  //GET ALL CONTROL PANELS FROM PICTURE
  router.get('/byPictureID/:pictureId', async (req, res) => {
    const controlpanelsFromGraph = (await quadelGraph.query(
      "MATCH (cp:ControlPanel)-[r:IS_IN]->(p:Picture)  WHERE ID(p) = $pictureId return ID(cp) as ID, cp.title as title, cp.description as description, cp.state as state, cp.type as type",
      {
        params:{
          pictureId: req.params.pictureId
        }
      }
    ))
    console.table(controlpanelsFromGraph.data);
    res.send(controlpanelsFromGraph.data)
  })


  router.get('/byBadState/', async (req, res) => {
    const controlpanelsFromGraph = (await quadelGraph.query(
      "MATCH (cp:ControlPanel)  WHERE NOT cp.state = 1 return ID(cp) as ID, cp.title as title, cp.description as description, cp.state as state, cp.type as type ORDER BY cp.state DESC"))
  
    console.table(controlpanelsFromGraph.data);
    res.send(controlpanelsFromGraph.data)
  })

//GET ALL CONTROL PANELS ORDER BY STATE
  router.get('/byStateSorted/', async (req, res) => {
    const controlpanelsFromGraph = (await quadelGraph.query(
      "MATCH (cp:ControlPanel) return ID(cp) as ID, cp.title as title, cp.description as description, cp.state as state, cp.type as type ORDER BY cp.state DESC"))
  
    console.table(controlpanelsFromGraph.data);
    res.send(controlpanelsFromGraph.data)
  })

  //GET ALL CONTROL PANELS BASED ON TEXT SEARCH
  router.get('/bySearch/:queryText', async (req, res) => {
    await quadelGraph.query("CALL db.idx.fulltext.createNodeIndex('ControlPanel', 'title', 'description', 'type')");
    const controlpanelsFromGraph = (await quadelGraph.query(
      "CALL db.idx.fulltext.queryNodes('ControlPanel', $queryText) YIELD node RETURN ID(node) as ID, node.title as title, node.description as description, node.state as state, node.type as type ORDER BY node.title",
      {
        params:{
          queryText: req.params.queryText + "*"
        }
      }
      ))
  
    console.table(controlpanelsFromGraph.data);
    res.send(controlpanelsFromGraph.data)
  })

  router.post("/timeseries/:startingOffset", (req, res) => {
    console.log("/timeseries/:startingOffset");
    console.log(req.params.startingOffset);

    generate_data(Number(req.params.startingOffset));


      return res.send({ message: "Data added successfully" });
    // });
  });


  router.post("/delete_timeseries", (req, res) => {
    deleteAllKeys();
      return res.send({ message: "Data deleted successfully" });
    // });
  });

  //GET TIME SERIES DATA BY ID FROM STARTTIMESTAMP TO END TIMESTAMP

  router.get("/timeseries/:elementId/:startTimestamp/:endTimestamp", (req, res) => {
    const key = req.params.elementId;
    const startTimestamp = req.params.startTimestamp;
    const endTimestamp = req.params.endTimestamp;

    clientTimeSeries.ts.range(key, startTimestamp, endTimestamp, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.send(result);
    });
  });

  //GET NUMBER OF ALARMS

  router.get("/timeseries/numberOfAlarmsOfElement/:elementId",async (req, res) => {
    let fromTimestamp = "-"; 
    let toTimestamp = "+";
    let elementId = req.params.elementId;
    const rangeResponse = await clientTimeSeries.ts.range(elementId, fromTimestamp, toTimestamp,
      {
        FILTER_BY_VALUE:{
          min:4,
          max:4
        },
        AGGREGATION:{
          type: TimeSeriesAggregationType.COUNT,
          timeBucket: 2419200000
        }
      }
    );
    console.table(rangeResponse);
    return res.send(rangeResponse);

  });

  router.get('/allElementsConnectedToCP/:cpID', async (req, res) => {
    console.log(req.params.cpID)
    const timeStampToValueSumMap = new Map();
    const timeStampsMap = new Map();

    const elementsFromGraph = (await quadelGraph.query(
      "MATCH (e:Element)-[r:IS_CONECTED_ON]->(cp:ControlPanel) WHERE ID(cp)=$cpID RETURN ID(e) as ID",
        {
          params:{
            cpID: Number (req.params.cpID)
          }
        }
    ));

    for(let i=0;i<elementsFromGraph.data.length;i++){
      console.log("I: "+i+" elementsFromGraph.ID: "+elementsFromGraph.data[i].ID);
      let fromTimestamp = "-"; 
      let toTimestamp = "+";
      let elementId = String (elementsFromGraph.data[i].ID);
      const tsd = (await clientTimeSeries.ts.range(elementId, fromTimestamp, toTimestamp,
        {
          FILTER_BY_VALUE:{
            min:4,
            max:4
          },
          AGGREGATION:{
            type: TimeSeriesAggregationType.COUNT,
            timeBucket: 2419200000
          }
        }
      ));
      for (let j = 0; j < tsd.length; j++) {
        timeStampsMap.set(tsd[j].timestamp , tsd[j].value);
      }
      for (let j = 0; j < tsd.length; j++) {
        timeStampToValueSumMap.set(tsd[j].timestamp , tsd[j].value);
      }


    }
      console.table(timeStampToValueSumMap);

  
    res.send(elementsFromGraph.data)
  })


