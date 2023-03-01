import { Entity, Schema } from 'redis-om'
import client from './client.js'

class Element extends Entity {}

/* create a Schema for Detector */
const elementSchema = new Schema(Element, {
  //id: {type: 'string'},
  title: { type: 'text' },
  description: { type: 'text' },
  state: { type: 'number' },
  type: { type: 'text' }
  })


/* use the client to create a Repository just for Detectors */
export const elementRepository = client.fetchRepository(elementSchema)

/* create the index for Person */
await elementRepository.createIndex()