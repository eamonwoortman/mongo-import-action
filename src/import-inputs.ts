import {NoFileOptions} from './constants'

export interface ImportInputs {
  searchPath: string
  uri: string
  database: string
  collection: string
  keepCollection: boolean
  ifNoFilesFound: NoFileOptions
}
