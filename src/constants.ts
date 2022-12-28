/*
        const inputFolder = core.getInput("input-folder");
        const uri = core.getInput("uri");
        const database = core.getInput("database");
        const collection = core.getInput("collection");
        const clearCollection = core.getInput("clear-collection");

*/

export enum Inputs {
    Path = 'artifact-folder',
    Uri = 'uri',
    Database = 'database',
    Collection = 'collection',
    KeepCollection = 'clear-collection',
    IfNoFilesFound = 'if-no-files-found',
  }
  
  export enum NoFileOptions {
    /**
     * Default. Output a warning but do not fail the action
     */
    warn = 'warn',
  
    /**
     * Fail the action with an error message
     */
    error = 'error',
  
    /**
     * Do not output any warnings or errors, the action does not fail
     */
    ignore = 'ignore'
  }