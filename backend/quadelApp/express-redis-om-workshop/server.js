import 'dotenv/config'

import express from 'express'

/* import routers */
import { router as elementRouter } from './routers/element-router.js'
import { router as elementSearchRouter } from './routers/element-search-router.js'
import { router as controlpanelRouter } from './routers/controlpanel-router.js'
import { router as controlpanelSearchRouter } from './routers/controlpanel-search-router.js'
import { router as pictureRouter } from './routers/picture-router.js'

/* create an express app and use JSON */
const app = new express()
app.use(express.json())

/* bring in some routers */
app.use('/element', elementRouter)
app.use('/elements', elementSearchRouter)
app.use('/controlpanel', controlpanelRouter)
app.use('/controlpanels', controlpanelSearchRouter)
app.use('/picture', pictureRouter)

/* start the server */
app.listen(8080)
