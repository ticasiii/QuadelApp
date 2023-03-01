import { Router } from "express";
import { elementRepository } from "../om/element.js";
import { quadelGraph } from "../om/quadelGraph.js"
import { stateEnum } from "../om/stateEnum.js"
import { createClient  } from 'redis';
const client = createClient();
client.on('error', (err) => console.log('Redis Client Error', err));

client.connect();

export const router = Router()
//CREATE ELEMENT NODE
router.put('/', async (req, res) => {
  const element = await elementRepository.createAndSave(req.body)

  //element.id = element.entityId
  const elementForGraph = (await quadelGraph.query(
  "MATCH (cp: ControlPanel) WHERE (ID(cp) = $controlPanelId)  CREATE (e:Element{ type: $type, description: $description, state: $state , title: $title })-[r:IS_CONNECTED_ON {chainID:$chainNumber} ]->(cp) RETURN e, cp, r",
  {
    params:{
    //id: detector.entityId,//   u cypher: entityId:id
    type: req.body.type,
    description: req.body.description, 
    state: req.body.state,
    controlPanelId: req.body.controlPanelId,
    title: req.body.title
    }
  }
))
console.log(elementForGraph.data[0]);
res.send(elementForGraph.data[0])
})

//GET ELEMENT NODE BY ID
router.get('/:id', async (req, res) => {
  const elementFromGraph = (await quadelGraph.query(
    "MATCH (e) WHERE ID(e) = $id return ID(e) as ID, e.description as description, e.state as state, e.type as type, e.title as title",
    {
      params:{
        id: Number(req.params.id)//OBAVEZAN PARSE
      }
    }
  ))
  console.table(elementFromGraph.data[0]);

  res.send(elementFromGraph.data[0])
})


//GET ELEMENT NODE BY address
router.get('/title/:title', async (req, res) => {
  const elementFromGraph = (await quadelGraph.query(
    "MATCH (e:ELEMENT) WHERE e.title = $title RETURN ID(e) as ID, e.description as description, e.state as state, e.type as type, e.title as title",
    {
      params:{
        title: req.params.title,
      }
    }
  ))

  console.table(elementFromGraph.data[0]);

  res.send(elementFromGraph.data[0])
})


//UPDATE CP STATE by ELEMENT STATE NODE ID
router.post('/state/:id', async (req, res) => {

  if(req.body.state != "ok"){

  const updatedElementNodeInGraph = (await quadelGraph.query(
    "MATCH (e:Element)-[r:IS_CONNECTED_ON]->(cp:ControlPanel) WHERE (ID(e)= $id) SET e.state = $state, cp.state = $state RETURN ID(cp) as ID, cp.title as title, cp.description as description, cp.state as state, cp.type as type ",
    {
      params:{
        id: Number(req.params.id),
        state: req.body.state
      }
    }

  ))
  console.table(updatedElementNodeInGraph.data[0]);
  res.send(updatedElementNodeInGraph.data[0])
  }
  else{
    console.log("nema potrebe za menjanje vrednosti polja state")
    res.send(req.body.state)

  }
})


//UPDATE ELEMENT NODE by NODE ID
router.post('/:id', async (req, res) => {

  const updatedElementNodeInGraph = (await quadelGraph.query(
    "MATCH (e) WHERE (ID(e) = $id) SET (e.state = $state, e.type = $type, e.description: $description, e.title: $title) RETURN ID(e) as ID, e.description as description, e.state as state, e.type as type, e.title as title",
    {
      params:{
        id: Number(req.params.id),
        type: req.body.type,
        description: req.body.description, 
        state: req.body.state,
        title: req.body.title
      }
    }

  ))
  console.table(updatedElementNodeInGraph.data[0]);
  res.send(updatedElementNodeInGraph.data[0])
  
})


//DELETE NODE by ID
router.delete('/:id', async (req, res) => {
  //await elementRepository.remove(req.params.id)
  //res.send({ entityId: req.params.id })

  await quadelGraph.query(
    "MATCH (e:Element) WHERE (ID(e) = $id) DELETE e",
    {
      params:{
        id: Number(req.params.id)
      }
    }
  
  )
  console.log("Node with ID: "+req.params.id+" is DELETED");
  res.send(req.params.id)
})

//CONNECT ELEMENT TO CONTROL PANEL IN GRAPH
router.post('/isConnectedOn/:elementId', async (req, res) => {

  await quadelGraph.query(
    "MATCH (e: Element), (cp: ControlPanel) WHERE (ID(e) = $elementId AND ID(cp) = $controlPanelId) CREATE (e)-[r:IS_CONNECTED_ON {chainID:$chainNumber} ]->(cp) RETURN type(r)",
    {
      params:{
        elementId: Number(req.params.elementId),
        controlPanelId: Number(req.body.controlPanelId),
        chainNumber: Number(req.body.chainNumber)
      }
    }
  )
  //console.log("Element Node with ID:  is CONNECTED on: ");

  console.log("Element Node with ID: "+req.params.id+" is CONNECTED on: "+req.body.controlPanelId);
  res.send(req.params.elementId)
  
})


//CONNECT ELEMENT NODE TO PICTURE NODE IN GRAPH
router.post('/isOn/:elementId', async (req, res) => {

  await quadelGraph.query(
    "MATCH (e: Element), (p: Picture) WHERE (ID(e) = $elementId AND ID(p) = $pictureId) CREATE (e)-[r:IS_ON]->(p) RETURN type(r)",
    {
      params:{
        elementId: Number(req.params.elementId),
        pictureId: Number(req.body.pictureId),
      }
    }
  )
  //console.log("Element Node with ID:  is CONNECTED on: ");

  console.log("Element Node with ID: "+req.params.elementId+" is on picture : "+req.body.pictureId);
  res.send(req.params.elementId)
  
})

router.get('/elementTSdata/:elementId', async (req, res) => { 
  let eId = req.params.elementId;
  const elementTSdata = (await client.ts.RANGE(eId, "-","+", { 
    FILTER_BY_VALUE: {
      min: 4,
      max: 4
    }
  }
  ));
})
