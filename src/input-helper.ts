import * as core from '@actions/core'
import {Inputs, NoFileOptions} from './constants'
import {ImportInputs} from './import-inputs'

/**
 * Helper to get all the inputs for the action
 */
export function getInputs(): ImportInputs {
  const path = core.getInput(Inputs.Path, {required: true})
  const uri = core.getInput(Inputs.Uri, {required: true})
  const database = core.getInput(Inputs.Database, {required: true})
  const collection = core.getInput(Inputs.Collection, {required: true})
  const keepCollection = core.getBooleanInput(Inputs.KeepCollection, {})

  const ifNoFilesFound = core.getInput(Inputs.IfNoFilesFound)
  const noFileBehavior: NoFileOptions =
    NoFileOptions[ifNoFilesFound as NoFileOptions]

  if (!noFileBehavior) {
    core.setFailed(
      `Unrecognized ${
        Inputs.IfNoFilesFound
      } input. Provided: ${ifNoFilesFound}. Available options: ${Object.keys(
        NoFileOptions
      )}`
    )
  }

  const inputs = {
    searchPath: path,
    uri,
    database,
    collection,
    keepCollection,
    ifNoFilesFound: noFileBehavior
  } as ImportInputs

  return inputs
}
