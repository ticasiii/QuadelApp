import { Router } from "express";
import { controlPanelRepository } from "../om/controlpanel.js";
import { quadelGraph } from "../om/quadelGraph.js"



export const router = Router()

//CREATE CP NODE
/*router.put('/', async (req, res) => {
  const controlpanel = await controlPanelRepository.createAndSave(req.body)
  res.send(controlpanel)
})*/
//CREATE CONTROL PANEL
router.put('/', async (req, res) => {
  //const controlpanel = await controlPanelRepository.createAndSave(req.body)
  const controlpanelForGraph = (await quadelGraph.query(
  "MATCH (p:Picture) WHERE (ID(p) = $pictureId) CREATE (cp:ControlPanel { title: $title, type: $type, description: $description, state: $state })-[r:IS_ON]->(p) RETURN p, cp, r",
  {
    params:{
    title: req.body.title,
    type: req.body.type,
    description: req.body.description, 
    state: Number(req.body.state),
    pictureId: req.body.pictureId,
    }
  }
))
console.log(controlpanelForGraph.data[0]);
res.send(controlpanelForGraph.data[0])
})

//GET ControlPanel NODE BY ID
router.get('/:id', async (req, res) => {
  const controlpanelFromGraph = (await quadelGraph.query(
    "MATCH (cp:ControlPanel)-[IS_ON]->(p:Picture) WHERE ID(cp) = $id return ID(cp) as ID, cp.title as title, cp.description as description, cp.state as state, cp.type as type, p.title as pictureTitle",
    {
      params:{
        id: Number(req.params.id)//OBAVEZAN PARSE
      }
    }
  ))
  console.table(controlpanelFromGraph.data[0]);

  res.send(controlpanelFromGraph.data[0])
})


//GET CP NODE BY TITLE
router.get('/title/:title', async (req, res) => {
  const controlpanelFromGraph = (await quadelGraph.query(
    "MATCH (cp:ControlPanel) WHERE cp.title = $title RETURN ID(cp) as ID, cp.title as title, cp.description as description, cp.state as state, cp.type as type",
    {
      params:{
        title: req.params.title
      }
    }
  ))

  console.table(controlpanelFromGraph.data[0]);
  res.send(controlpanelFromGraph.data[0])
})


/*router.get('/:id', async (req, res) => {
  const controlpanel = await controlPanelRepository.fetch(req.params.id)
  res.send(controlpanel)
})*/


//UPDATE CONTROL PANEL NODE STATE by NODE ID
router.post('/state/:id', async (req, res) => {
  const updatedControlPanelNodeInGraph = (await quadelGraph.query(
    "MATCH (cp) WHERE (ID(cp) = $id) SET cp.state = $state RETURN ID(cp) as ID, cp.title as title, cp.description as description, cp.state as state, cp.type as type",
    {
      params:{
        id: Number(req.params.id),
        state: req.body.state
      }
    }
  ))
  console.table(updatedControlPanelNodeInGraph.data[0]);
  res.send(updatedControlPanelNodeInGraph.data[0])
   
})

//UPDATE CONTROL PANEL NODE by NODE ID
router.post('/:id', async (req, res) => {
  const updatedControlPanelNodeInGraph = (await quadelGraph.query(
    "MATCH (cp) WHERE (ID(cp) = $id) SET (cp.state = $state, cp.type = $type, cp.title: $title, cp.description: $description) RETURN ID(cp) as ID, cp.title as title, cp.description as description, cp.state as state, cp.type as type",
    {
      params:{
        id: Number(req.params.id),
        title: req.body.title,
        type: req.body.type,
        description: req.body.description, 
        state: req.body.state,
      }
    }

  ))
  console.table(updatedControlPanelNodeInGraph.data[0]);
  res.send(updatedControlPanelNodeInGraph.data[0])
  
})

/*router.delete('/:id', async (req, res) => {
  await controlPanelRepository.remove(req.params.id)
  res.send({ entityId: req.params.id })
})*/

//DELETE CP NODE by ID
router.delete('/:id', async (req, res) => {
   await quadelGraph.query(
    "MATCH (cp:ControlPanel) WHERE (ID(cp) = $id) DELETE cp",
    {
      params:{
        id: Number(req.params.id)
      }
    }

  )
  console.log("CP Node with ID: "+req.params.id+" is DELETED");
  res.send(req.params.id)
  

})


//CONNECT CONTROL PANEL NODE TO PICTURE NODE IN GRAPH
router.post('/isOn/:controlPanelId', async (req, res) => {

  await quadelGraph.query(
    "MATCH (cp: ControlPanel), (p: Picture) WHERE (ID(cp) = $controlPanelId AND ID(p) = $pictureId) CREATE (cp)-[r:IS_ON]->(p) RETURN type(r)",
    {
      params:{
        controlPanelId: Number(req.params.controlPanelId),
        pictureId: Number(req.body.pictureId),
      }
    }
  )
  //console.log("Element Node with ID:  is CONNECTED on: ");

  console.log("ControlPanel Node with ID: "+req.params.controlPanelId+" is on picture : "+req.body.pictureId);
  res.send(req.params.controlPanelId)
  
})



