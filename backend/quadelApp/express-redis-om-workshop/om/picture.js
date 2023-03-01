import { Entity, Schema } from 'redis-om'
import client from './client.js'

class Picture extends Entity {}

/* create a Schema for Detector */
const pictureSchema = new Schema(Picture, {
  description: { type: 'text' },
  state: { type: 'number' },
  title: { type: 'text' }
  })

/* use the client to create a Repository just for Detectors */
export const pictureRepository = client.fetchRepository(pictureSchema)

/* create the index for Person */
await pictureRepository.createIndex()

