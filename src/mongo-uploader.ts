import * as core from '@actions/core'
import {promises as fs} from 'fs'
import {Collection, MongoClient} from 'mongodb'

export interface UploadResponse {
  failedItems: string[]
}

interface UploadResult {
  path: string
  status: 'success' | 'failed'
}

export class MongoUploader {
  uri: string
  database: string
  collection: string
  keepCollection: boolean

  constructor(
    uri: string,
    database: string,
    collection: string,
    keepCollection: boolean
  ) {
    this.uri = uri
    this.database = database
    this.collection = collection
    this.keepCollection = keepCollection
  }

  private getCollection(
    client: MongoClient,
    databaseName: string,
    collectionName: string
  ): Collection {
    const database = client.db(databaseName)
    return database.collection(collectionName)
  }

  private async loadJson(path: string): Promise<any> {
    const jsonString = await fs.readFile(path, 'utf8')
    return JSON.parse(jsonString)
  }

  private async uploadFile(
    collection: Collection,
    path: string
  ): Promise<UploadResult> {
    try {
      const fileJson = await this.loadJson(path)
      await collection.insertOne(fileJson)
      core.debug(`Successfully uploaded ${path} to collection`)
    } catch (error: any) {
      core.warning(`failed to parse json: ${error}}`)
      return {path, status: 'failed'}
    }
    return {path, status: 'success'}
  }

  async uploadArtifact(
    filesToUpload: string[],
    rootDirectory: string
  ): Promise<UploadResponse> {
    const client: MongoClient = await MongoClient.connect(this.uri)
    let failedItems: string[] = []

    try {
      const collection = this.getCollection(
        client,
        this.database,
        this.collection
      )
      if (!collection) {
        // Todo: should we create the collection instead of failing?
        core.setFailed(`Collection ${this.collection} does not exist.`)
      }

      if (!this.keepCollection) {
        // Todo: instead of calling `deleteMany`, use `drop` instead and create a new collection
        await collection.deleteMany({})
      }

      // Process artifact files
      const uploadPromises = filesToUpload.map(async file => {
        return this.uploadFile(collection, file)
      })
      const results = await Promise.all(uploadPromises)
      failedItems = results.filter(x => x.status === 'failed').map(x => x.path)
    } finally {
      await client.close()
    }
    return {failedItems} as UploadResponse
  }
}
