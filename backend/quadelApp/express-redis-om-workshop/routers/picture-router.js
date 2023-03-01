import { Router } from "express";
import { pictureRepository } from "../om/picture.js";
import { quadelGraph } from "../om/quadelGraph.js"


export const router = Router()


//CREATE PICTUREs NODE
router.put('/allPictures', async (req, res) => {
  //const picture = await pictureRepository.createAndSave(req.body)
let index = 0;
  while (index<1) {
    const pictureForGraph = (await quadelGraph.query(
      "CREATE (p:Picture { description: $description, state: $state, title: $title }) RETURN ID(p) as ID, p.description as description, p.title as title, p.state as state",
      {
        params:{
        title: "Sever",
        description: "Toplana sever includes rooms including transformer station, dining room, warehouse, wardrobe, bathroom, toilet, kitchen, office, command room and the room where the steam boiler is located.",
        state: 1
        }
      }
    ))
    console.log(pictureForGraph.data[0]);
    index++
    
  }
  console.log("all pictures is inserted");

  res.send("all pictures is inserted")

})


//CREATE ALL CPs NODES
router.put('/allCPs', async (req, res) => {
  //const picture = await pictureRepository.createAndSave(req.body)
  let index = 0;
  const array = [0,2,3,7,10,11,12,13,14,18,20,21,24,26];
  let title1Const = "ALPHA 1100";
  let title2Const = "ALPHA 2100";
  let typeCP = "analog-addresible";
  let descriptionCP="";
  let titleCP="";
  while (index<27) {
    if (array.includes(index)) {
      titleCP=title1Const;
      descriptionCP = "This modern microprocessor device is intended for processing of analogue-addressable, ESP compatible fire sensors and I/0 devices. Control panel is compliant with EN54-2 and EN54-4.";
    }
    else{
      titleCP=title2Const;
      descriptionCP = "This is a fire protection control panel with very flexibile stricture intended for processing of analogue-addressable, HOCHIKI ESP compatible fire sensors and I/0 devices, for medium and big objects systems sizes";
    }
    const controlpanelForGraph = (await quadelGraph.query(
      "CREATE (cp:ControlPanel { title: $title, type: $type, description: $description, state: $state }) RETURN cp",
      {
        params:{
          title: titleCP,
          type: typeCP,
          description: descriptionCP, 
          state: 1,
        }
      }
    ));
  //console.log(controlpanelForGraph.data[0]);
  index++
  }
  console.log("all CPs are inserted");
  res.send("all CPs are inserted")

})

//Connect ALL CP NODES to Pictures
router.post('/connectAllCPs', async (req, res) => {
  //const picture = await pictureRepository.createAndSave(req.body)
  let pom =0
let index = 0;
  while (index<27) {
    if (index<7){
      pom=1530
    }
    else if(index<14)
    {
      pom=1531
    }
    else if (index<19) {
      pom=1532
    }
    else if (index<24) {
      pom=1533
    }
    else if (index<25) {
      pom=1534
    }
    else if (index<26) {
      pom=1535
    }
    else {
      pom=1536
    }
    
    const controlpanelForGraph = (await quadelGraph.query(
      "MATCH (p:Picture), (cp:ControlPanel) WHERE (ID(p) = $pictureId) AND (ID(cp) = $index) CREATE (cp)-[r:IS_ON]->(p) RETURN p, cp, r",
      {
        params:{

          description: req.body.description+" and it is in "+req.body.pictureId+" room N"+String(index), 
          pictureId: pom,
          index:index
        }
      }
    ))
    console.log(controlpanelForGraph.data[0]);
    index++
    
  }
  console.log("all CPs are connected to pics");

  res.send("all CPs are connected to pics")

})

//Connect ALL CP NODES to Pictures
router.post('/connectNeighbourPictures/:id', async (req, res) => {
  //const picture = await pictureRepository.createAndSave(req.body)
  const picturesForGraph = (await quadelGraph.query(
      "MATCH (p:Picture), (n:Picture) WHERE (ID(p) = $pictureId) AND (ID(n) = $neighbourId) MERGE (p)-[r:IS_NEXT_TO]-(n) RETURN p, n, r",
      {
        params:{
          pictureId: Number (req.params.id),
          neighbourId:Number(req.body.neighbourId)
        }
      }
    ))
  console.table(picturesForGraph.data[0]);
  console.log(req.params.id+" id NEXT_TO "+ req.body.neighbourId);
  res.send(req.params.id+" id NEXT_TO "+ req.body.neighbourId)

})

//CREATE ALL Element NODES
router.put('/allElements', async (req, res) => {
  //const picture = await pictureRepository.createAndSave(req.body)
  let name_of_element ="";
  let type_of_element="";
  let description_of_element="";
  let pomP =0;
  let pomC =0;
let index = 27;
  while (index<1530) {
    if (index % 8 === 1 || index % 8 === 2 || index % 8 === 3) {
      name_of_element = 'HCP_E';
      type_of_element = 'Hand point';
      description_of_element = 'Analogue Addressable Manual Call Point HCP-E Model is a Manual Call Point. The HCP-E incorporates a red LED moun'; // The description continues on the next line
    }
    else if (index % 8 === 4 || index % 8 === 5){
      name_of_element = 'ACC_EN';
      type_of_element = 'Multi sensor';
      description_of_element = 'This is a Multi-Sensor, which is fully compatible with ESP Analogue Addressable Protocol and incorporates a thermal element and High-Performance photoelectric smoke chamber.'
    }
    else if (index % 8 === 6){
      name_of_element = 'ATJ_EN';
      type_of_element = 'Thermal multi sensor';
      description_of_element = 'This is a Multi-Heat Sensor, which is fully compatible with ESP Analogue Addressable Protocol.'
    }
    else if (index % 8 === 7){
      name_of_element = 'ALN_EN';
      type_of_element = 'Optical photoelectric smoke sensor';
      description_of_element = 'This is a Photoelectric Smoke Sensor with SCI, which is fully compatible with ESP Analogue Addressable Protocol'
    }
    else if (index % 8 === 0){
      name_of_element = 'CHQ-MRC2';
      type_of_element = 'Module I/O';
      description_of_element = 'is a Single Input/Output Module, which provides a single, mains-rated relay output for the control of such devices as dampers, access control equipment (e.g. door magnets), extractors'
    }
    if (index<59){
      pomC=0
      pomP=1530;

    }
    else if(index<103)
    {
      pomC=1
      pomP=1531;

    }
    else if (index<181) {
      pomC=2
      pomP=1531;

    }
    else if (index<213) {
      pomC=3
      pomP=1532;

    }
    else if (index<262) {
      pomC=4
      pomP=1533;
    }
    else if(index<349)
    {
      pomC=5
      pomP=1533
    }
    else if (index<416) {
      pomC=6
      pomP=1533
    }
    else if (index<448) {
      pomC=7
      pomP=1534
    }
    else if (index<506) {
      pomC=8
      pomP=1534
    }
    else if(index<587)
    {
      pomC=9
      pomP=1535

    }
    else if (index<685) {
      pomC=10
      pomP=1535
    }
    else if (index<722) {
      pomC=11
      pomP=1535
    }
    else if (index<773) {
      pomC=12
      pomP=1535
    }
    else if(index<816)
    {
      pomC=13
      pomP=1535
    }
    else if (index<858) {
      pomC=14
      pomP=1536
    }
    else if (index<906) {
      pomC=15
      pomP=1537
    }
    else if (index<958) {
      pomC=16
      pomP=1538
    }
    else if (index<989) {
      pomC=17
      pomP=1538
    }
    else if (index<1037) {
      pomC=18
      pomP=1538
    }
    else if(index<1164)
    {
      pomC=19
      pomP=1539

    }
    else if (index<1218) {
      pomC=20
      pomP=1539
    }
    else if (index<1254) {
      pomC=21
      pomP=1540
    }
    else if (index<1336) {
      pomC=22
      pomP=1540
    }
    else if(index<1378)
    {
      pomC=23
      pomP=1540
    }
    else if (index<1428) {
      pomC=24
      pomP=1541
    }
    else if (index<1460) {
      pomC=25
      pomP=1542
    }
    else
    {
      pomC=26
      pomP=1543
    }
    const elementsForGraph = (await quadelGraph.query(
      "MATCH (cp:ControlPanel) WHERE (ID(cp) = $cpID) CREATE (e:Element { title: $title, type: $type, description: $description, state: $state })-[r:IS_CONECTED_ON]->(cp) RETURN cp, e, r",
      {
        params:{
          title: name_of_element,
          type: type_of_element,
          description: description_of_element, 
          state: 1,
          cpID:pomC
        }
      }
    ))
    console.log(elementsForGraph.data[0]);
    index++
    
  }
  console.log("all ELEMENTS are inserted");

  res.send("all ELEMENTS are inserted")

})

//CONNECT ALL Element NODES TO PICTURE NODES
router.post('/connectAllElements', async (req, res) => {
  //const picture = await pictureRepository.createAndSave(req.body)
  let pomP =0;
  let pomC =0;
let index = 27;
  while (index<1530) {
    if (index<59){
      pomC=0
      pomP=1530;

    }
    else if(index<103)
    {
      pomC=1
      pomP=1531;

    }
    else if (index<181) {
      pomC=2
      pomP=1531;

    }
    else if (index<213) {
      pomC=3
      pomP=1532;

    }
    else if (index<262) {
      pomC=4
      pomP=1533;
    }
    else if(index<349)
    {
      pomC=5
      pomP=1533
    }
    else if (index<416) {
      pomC=6
      pomP=1533
    }
    else if (index<448) {
      pomC=7
      pomP=1534
    }
    else if (index<506) {
      pomC=8
      pomP=1534
    }
    else if(index<587)
    {
      pomC=9
      pomP=1535

    }
    else if (index<685) {
      pomC=10
      pomP=1535
    }
    else if (index<722) {
      pomC=11
      pomP=1535
    }
    else if (index<773) {
      pomC=12
      pomP=1535
    }
    else if(index<816)
    {
      pomC=13
      pomP=1535
    }
    else if (index<858) {
      pomC=14
      pomP=1536
    }
    else if (index<906) {
      pomC=15
      pomP=1537
    }
    else if (index<958) {
      pomC=16
      pomP=1538
    }
    else if (index<989) {
      pomC=17
      pomP=1538
    }
    else if (index<1037) {
      pomC=18
      pomP=1538
    }
    else if(index<1164)
    {
      pomC=19
      pomP=1539

    }
    else if (index<1218) {
      pomC=20
      pomP=1539
    }
    else if (index<1254) {
      pomC=21
      pomP=1540
    }
    else if (index<1336) {
      pomC=22
      pomP=1540
    }
    else if(index<1378)
    {
      pomC=23
      pomP=1540
    }
    else if (index<1428) {
      pomC=24
      pomP=1541
    }
    else if (index<1460) {
      pomC=25
      pomP=1542
    }
    else
    {
      pomC=26
      pomP=1543
    }
    const elementsForGraphConnToPics = (await quadelGraph.query(
      "MATCH (p:Picture), (e:Element) WHERE (ID(e) = $elementID) AND (ID(p) = $pictureID) CREATE (e)-[r:IS_ON]->(p) RETURN p, e, r",
      {
        params:{
          pictureID:pomP,
          elementID:index
        }
      }
    ))
    console.log(elementsForGraphConnToPics.data[0]);
    index++
    
  }
  console.log("all ELEMENTS are connected to pictures");

  res.send("all ELEMENTS are connected to pictures")

})


//GET PICTURE NODE BY ID
router.get('/id/:id', async (req, res) => {
  const pictureFromGraph = (await quadelGraph.query(
    "MATCH (p:Picture) WHERE (ID(p) = $id) return ID(p) as ID, p.title as title, p.description as description, p.state as state",
    {
      params:{
        id: Number(req.params.id)//OBAVEZAN PARSE
      }
    }
  ))
  console.log(pictureFromGraph.data[0]);

  res.send(pictureFromGraph.data[0])
})


//GET PICTURE NODE BY TITLE
router.get('/title/:title', async (req, res) => {
  const pictureFromGraph = (await quadelGraph.query(
    "MATCH (p:Picture) WHERE p.title = $title RETURN ID(p) as ID, p.description as description, p.state as state, p.title as title",
    {
      params:{
        title: req.params.title,
      }
    }
  ))

  console.table(pictureFromGraph.data[0]);

  res.send(pictureFromGraph.data[0])
})


//UPDATE picture NODE STATE by NODE ID
router.post('/state/:id', async (req, res) => {

  const updatedPictureNodeInGraph = (await quadelGraph.query(
    "MATCH (p:Picture) WHERE (ID(p)= $id) SET p.state = $state RETURN ID(p) as ID, p.title as title, p.description as description, p.state as state",
    {
      params:{
        id: Number(req.params.id),
        state: req.body.state
      }
    }

  ))
  console.table(updatedPictureNodeInGraph.data[0]);
  
  res.send(updatedPictureNodeInGraph.data[0]);
})


//UPDATE PICTURE NODE by NODE ID
router.post('/byPictureId/:id', async (req, res) => {

  const updatedPictureNodeInGraph = (await quadelGraph.query(
    "MATCH (p:Picture) WHERE (ID(p) = $id) SET (p.state = $state, p.description: $description, p.title: $title) RETURN ID(p) as ID, p.description as description, p.state as state, p.title as title",
    {
      params:{
        id: Number(req.params.id),
        title: req.body.title,
        description: req.body.description, 
        state: req.body.state
      }
    }

  ))
  console.table(updatedPictureNodeInGraph.data[0]);
  res.send(updatedPictureNodeInGraph.data[0])
  
})


//DELETE NODE by ID
router.delete('/:id', async (req, res) => {
  //await elementRepository.remove(req.params.id)
  //res.send({ entityId: req.params.id })

  await quadelGraph.query(
    "MATCH (p:Picture) WHERE (ID(p) = $id) DELETE p",
    {
      params:{
        id: Number(req.params.id)
      }
    }
  
  )
  console.log("Node with ID: "+req.params.id+" is DELETED");
  res.send(req.params.id)
})


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

 //GET ALL CONTROL PANELS FROM PICTURE
 router.get('/allSystemElementsFromSamePicture/:pictureId', async (req, res) => {
  const elementsFromGraph = (await quadelGraph.query(
    "OPTIONAL MATCH (cp)-[r:IS_ON]->(p:Picture) WHERE ID(p) = $pictureId RETURN ID(cp) as ID, cp.description as description, cp.state as state, cp.type as type, cp.title as title ORDER BY ID(cp)",
    {
      params:{
        pictureId: req.params.pictureId
      }
    }
  ))

  console.table(elementsFromGraph.data);
  res.send(elementsFromGraph.data)
})

//GET ALL SYSTEM ELEMENTS
router.get('/allSystemElements/', async (req, res) => {
  const elementsFromGraph = (await quadelGraph.query(
    "MATCH (cp:ControlPanel) RETURN ID(cp) as id, cp.description as description, cp.state as state, cp.type as type, cp.title as title ORDER BY cp.state DESC UNION MATCH (e:Element) RETURN ID(e) as id, e.description as description, e.state as state, e.type as type, e.title as title ORDER BY e.state DESC"))

  console.log(elementsFromGraph.data);
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
      "MATCH (cp:ControlPanel)  WHERE ID(p) = $pictureId return ID(cp) as ID, cp.title as title, cp.description as description, cp.state as state, cp.type as type",
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

  //GET ALL PICTURES ORDER BY STATE >1
  router.get('/allAlertedSortedByState/', async (req, res) => {
    const controlpanelsFromGraph = (await quadelGraph.query(
      "MATCH (p:Picture) WHERE p.state>1 RETURN ID(p) as ID, p.title as title, p.description as description, p.state as state, p.type as type ORDER BY p.state DESC"))
  
    console.table(controlpanelsFromGraph.data);
    res.send(controlpanelsFromGraph.data)
  })

  //GET ALL FAVORITES PICTURES
  router.get('/fromFavoriteList/', async (req, res) => {
    const controlpanelsFromGraph = (await quadelGraph.query(
        "MATCH (p:Picture) WHERE ID(p) IN (toIntegerList($arrayIds)) RETURN ID(p) as ID, p.title as title, p.description as description, p.state as state ORDER BY p.state DESC",
        {
          params:{
            arrayIds: req.body.arrayIds
          }
        }
      ))
    console.table(controlpanelsFromGraph.data);
    res.send(controlpanelsFromGraph.data)
  })

    //GET ALL FAVS AND ALERTS PICTURES
    router.get('/favoritesAndAlerts/:arrayIds', async (req, res) => {
            console.log(req.params);
            console.log(req.params.arrayIds.slice(1,req.params.arrayIds.length-1).split(', '));

      const controlpanelsFromGraph = (await quadelGraph.query(
          "MATCH (p:Picture) WHERE p.state>1 RETURN ID(p) as ID, p.title as title, p.description as description, p.state as state ORDER BY p.state DESC UNION MATCH (p:Picture) WHERE ID(p) IN (toIntegerList($arrayIds)) RETURN ID(p) as ID, p.title as title, p.description as description, p.state as state ORDER BY p.state DESC UNION MATCH (p:Picture) WHERE p.state = 4 RETURN ID(p) as ID, p.title as title, p.description as description, p.state as state UNION MATCH (p:Picture)-[r:IS_NEXT_TO]-(n:Picture) WHERE p.state = 4 RETURN ID(n) as ID, n.title as title, n.description as description, n.state as state",
          {
            params:{
              arrayIds: req.params.arrayIds.slice(1,req.params.arrayIds.length-1).split(', ')
            }
          }
        ))
      console.table(controlpanelsFromGraph.data);
      res.send(controlpanelsFromGraph.data)
    })

    //GET PICTURES FROM NEIGHBOUR ALARM
router.get('/getPicturesFromNeighbourhoodAlarm', async (req, res) => {
  //const picture = await pictureRepository.createAndSave(req.body)
  const picturesForGraph = (await quadelGraph.query(
      "MATCH (p:Picture) WHERE p.state = 4 RETURN ID(p) as ID, p.title as title, p.state as state, p.description as description UNION MATCH (p:Picture)-[r:IS_NEXT_TO]-(n:Picture) WHERE p.state = 4 RETURN ID(n) as ID, n.title as title, n.state as state, n.description as description"
      ))
  console.table(picturesForGraph.data);
  res.send(picturesForGraph.data)

})


    //GET simple ALL PICTURES
    router.get('/all/', async (req, res) => {
        const picturesFromGraph = (await quadelGraph.query(
          "MATCH (p:Picture) return ID(p) as ID, p.title as title, p.description as description, p.state as state"))
      
          console.table(picturesFromGraph.data);
          res.send(picturesFromGraph.data)
      
      
        }
    );


  
  //GET ALL PICTURES BASED ON TEXT SEARCH
  router.get('/bySearch/:queryText', async (req, res) => {
    await quadelGraph.query("CALL db.idx.fulltext.createNodeIndex('Picture', 'title', 'description')");
    const picturesFromGraph = (await quadelGraph.query(
      "CALL db.idx.fulltext.queryNodes('Picture', $queryText) YIELD node RETURN ID(node) as ID, node.title as title, node.description as description, node.state as state ORDER BY node.title",
      {
        params:{
          queryText: req.params.queryText + "*"
        }
      }
      ))
  
    console.table(picturesFromGraph.data);
    res.send(picturesFromGraph.data)
  })

    //GET ALL ELEMENTS BASED ON TEXT SEARCH
    router.get('/byElementsSearch/:queryText', async (req, res) => {
      await quadelGraph.query("CALL db.idx.fulltext.createNodeIndex('ControlPanel', 'title', 'description', 'type')");
      await quadelGraph.query("CALL db.idx.fulltext.createNodeIndex('Element', 'title', 'description', 'type')");


      const picturesFromGraph = (await quadelGraph.query(
        "CALL db.idx.fulltext.queryNodes('ControlPanel', $queryText) YIELD node RETURN ID(node) as ID, node.title as title, node.description as description, node.state as state, node.type as type ORDER BY node.title UNION CALL db.idx.fulltext.queryNodes('Element', $queryText) YIELD node RETURN ID(node) as ID, node.title as title, node.description as description, node.state as state, node.type as type ORDER BY node.title",
        {
          params:{
            queryText: req.params.queryText + "*"
          }
        }
        ))
    
      console.table(picturesFromGraph.data);
      res.send(picturesFromGraph.data)
    })






