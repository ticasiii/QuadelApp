import { Router } from 'express'
import { elementRepository } from '../om/element.js'
import { quadelGraph } from "../om/quadelGraph.js"

export const router = Router()

/*router.get('/all', async (req, res) => {
    const elements = await elementRepository.search().return.all()
    res.send(elements)
})*/

router.get('/all', async (req, res) => {
     const controlpanelsFromGraph = (await quadelGraph.query(
       "MATCH (cp:Element) return ID(cp) as ID, cp.title as title, cp.description as description, cp.state as state, cp.type as type",
 
     ))
     console.table(controlpanelsFromGraph.data);
     //OBRATITI PAZNJU NA FORMAT U KOM VRATI NIZ CONTROL PANELA
     res.send(controlpanelsFromGraph.data)
 })


/*router.get('/by-ChainNumber/:chainNumber', async (req, res) => {
    const chainNumber = req.params.chainNumber
    const elements = await elementRepository.search()
      .where('chainNumber').matches(chainNumber).return.all()
    res.send(elements)
  })
*/

  router.get('/by-ChainNumber/:chainNumber', async (req, res) => {
    const elementsFromGraph = (await quadelGraph.query(
      //"MATCH (e:Element)  WHERE e.chainNumber = $chainNumber return ID(e) as ID, e.title as title, e.title as title, e.description as description, e.state as state, e.pictureId as pictureId, e.type as type",
      "MATCH (e:Element)-[r:IS_CONNECTED_ON {chainID:$chainNumber} ]->(cp:ControlPanel) return ID(e) as ID, e.title as title, e.description as description, e.state as state, e.type as type",
      {
        params:{
          chainNumber: req.params.chainNumber
        }
      }
    ))
  
    console.table(elementsFromGraph.data);
    res.send(elementsFromGraph.data)
  })



  /*router.get('/by-PictureId/:pictureId', async (req, res) => {
    const pictureId = req.params.pictureId
    const elements = await elementRepository.search()
      .where('pictureId').equals(pictureId).return.all()
    res.send(elements)
  })*/

  router.get('/by-PictureId/:pictureId', async (req, res) => {
    const elementsFromGraph = (await quadelGraph.query(
      "MATCH (e:Element)-[r:IS_IN]->(p:Picture)  WHERE ID(p) = $pictureId return ID(e) as ID, e.title as title, e.description as description, e.state as state, e.type as type",
      {
        params:{
          pictureId: req.params.pictureId
        }
      }
    ))
  
    console.table(elementsFromGraph.data);
    res.send(elementsFromGraph.data)
  })

  //return sort by state

  router.get('/byState/', async (req, res) => {
    const elementsFromGraph = (await quadelGraph.query(
      "MATCH (e:Element) return ID(e) as ID, e.title as title, e.description as description, e.state as state, e.type as type ORDER BY e.state DESC"))
  
    console.table(elementsFromGraph.data);
    res.send(elementsFromGraph.data)
  })

//GET ALL NODES WITH SAME CHAIN NUMBER IN RELATIONSHIP PROPERTY
router.get('/allFromSameChain/:chainNumber', async (req, res) => {

  const chainedElementNodeInGraph = (await quadelGraph.query(
    "MATCH (e:Element)-[r:IS_CONNECTED_ON {chainID:$chainNumber} ]->(cp:ControlPanel) return e,cp",

    {
      params:{
        chainNumber: Number(req.params.chainNumber),
      }
    }
  ))
  console.log(req.params.chainNumber+" chain Number")
  console.table(chainedElementNodeInGraph.data);
  res.send(chainedElementNodeInGraph.data)
  
})

 //GET ALL ELEMENTS BASED ON TEXT SEARCH
 router.get('/bySearch/:queryText', async (req, res) => {
  await quadelGraph.query("CALL db.idx.fulltext.createNodeIndex('Element', 'description', 'type', 'title')");
  const searchedElementsFromGraph = (await quadelGraph.query(
    "CALL db.idx.fulltext.queryNodes('Element', $queryText) YIELD node RETURN ID(node) as ID, node.description as description, node.state as state, node.type as type, node.title as title ORDER BY node.title",
    {
      params:{
        queryText: req.params.queryText + "*"
      }
    }
    ))

  console.table(searchedElementsFromGraph.data);
  res.send(searchedElementsFromGraph.data)
})


//create all elements and connect them to CPs
//CREATE ALL Element NODES
router.put('/allElements', async (req, res) => {
  let pomP =0;
  let pomC =0;
let index = 27;
  while (index<1530) {
    if (index<59){
      pomC=0
      pomP=0;

    }
    else if(index<103)
    {
      pomC=1
      pomP=0;

    }
    else if (index<181) {
      pomC=2
      pomP=0;

    }
    else if (index<213) {
      pomC=3
      pomP=0;

    }
    else if (index<262) {
      pomC=4
      pomP=0;
    }
    else if(index<349)
    {
      pomC=5
      pomP=1
    }
    else if (index<416) {
      pomC=6
      pomP=1
    }
    else if (index<448) {
      pomC=7
      pomP=1
    }
    else if (index<506) {
      pomC=8
      pomP=2
    }
    else if(index<587)
    {
      pomC=9
      pomP=2;

    }
    else if (index<685) {
      pomC=10
      pomP=2;
    }
    else if (index<722) {
      pomC=11
      pomP=2;
    }
    else if (index<773) {
      pomC=12
      pomP=2;
    }
    else if(index<816)
    {
      pomC=13
      pomP=2
    }
    else if (index<858) {
      pomC=14
      pomP=2
    }
    else if (index<906) {
      pomC=15
      pomP=3
    }
    else if (index<958) {
      pomC=16
      pomP=3
    }
    else if (index<989) {
      pomC=17
      pomP=4
    }
    else if (index<1037) {
      pomC=18
      pomP=4
    }
    else if(index<1164)
    {
      pomC=19
      pomP=4

    }
    else if (index<1218) {
      pomC=20
      pomP=4
    }
    else if (index<1254) {
      pomC=21
      pomP=4
    }
    else if (index<1336) {
      pomC=22
      pomP=4
    }
    else if(index<1378)
    {
      pomC=23
      pomP=4
    }
    else if (index<1428) {
      pomC=24
      pomP=4
    }
    else if (index<1460) {
      pomC=25
      pomP=5
    }
    else
    {
      pomC=26
      pomP=5
    }


    const elementsForGraph = (await quadelGraph.query(
      
        "MATCH (cp:ControlPanel) WHERE (ID(cp) = $controlPanelId) CREATE (e:Element { title: $title, type: $type, description: $description, state: $state })-[r:IS_CONNECTED_ON {chainID:$chainNumber} ]->(cp) RETURN e,cp,r",
        {
          params:{
            chainNumber: Number(req.body.chainNumber),
            description: req.body.description+" for ELEMENT and it is connected to  ControlPanel", 
            state: Number(req.body.state),
            title: req.body.title+".proba.1",
            controlPanelId:pomC,
            type: req.body.type
  
          }
        }
      ) 
  )
  index++;
}



  console.log("all Elements are inserted");

  res.send("all Elements are inserted")

})

