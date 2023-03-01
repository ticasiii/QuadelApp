import { Entity, Schema } from 'redis-om'
import client from './client.js'

class ControlPanel extends Entity {}

/* create a Schema for ControlPanel */
const controlPanelSchema = new Schema(ControlPanel, {
    type: { type: 'text' },
    title: { type: 'text' },
    description: { type: 'text' },
    state: { type: 'number' },
  })




/* use the client to create a Repository just for ControlPanel */
export const controlPanelRepository = client.fetchRepository(controlPanelSchema)

/* create the index for ControlPanel */
await controlPanelRepository.createIndex()