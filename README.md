# Mongo-Import-Action v1

Uploads JSON artifacts from your workflow into an existing MongoDB collection.


This action is largely based on [upload-artifact](https://github.com/actions/upload-artifact) and [1password-action](https://github.com/RobotsAndPencils/1password-action). 

*Mongo-Import-Action* purely created for my own needs, but despite not being actively maintained, PR's are welcome!

# Warning!
This action will **clear** the target collection before uploading new documents, unless `keep-collection` is set to `true`.  

# Usage

See [action.yml](action.yml)

### Upload an Individual File

```yaml
steps:
- uses: actions/checkout@v3

- run: mkdir -p path/to/artifact

- run: echo "{ foo: bar }" > path/to/artifact/world.json

- uses: actions/mongo-import@v1
  with:
    path: path/to/artifact/world.json
    uri: '${{ secrets.MONGODB_URI }}'
    database: mydatabase
    collection: mycollection

```

### Upload an Entire Directory

```yaml
- uses: actions/mongo-import@v1
  with:
    path: path/to/artifact/
    # ... uri, database, collection
```

### Upload using a Wildcard Pattern

```yaml
- uses: actions/mongo-import@v1
  with:
    path: path/**/[abc]rtifac?/*
    # ... uri, database, collection
```

### Upload using Multiple Paths and Exclusions

```yaml
- uses: actions/mongo-import@v1
  with:
    path: |
      path/output/bin/
      path/output/test-results
      !path/**/*.tmp
     # ... uri, database, collection
```

For supported wildcards along with behavior and documentation, see [@actions/glob](https://github.com/actions/toolkit/tree/main/packages/glob) which is used internally to search for files.

If a wildcard pattern is used, the path hierarchy will be preserved after the first wildcard pattern:

```
path/to/*/directory/foo?.txt =>
    ∟ path/to/some/directory/foo1.txt
    ∟ path/to/some/directory/foo2.txt
    ∟ path/to/other/directory/foo1.txt

would be flattened and uploaded as =>
    ∟ some/directory/foo1.txt
    ∟ some/directory/foo2.txt
    ∟ other/directory/foo1.txt
```

If multiple paths are provided as input, the least common ancestor of all the search paths will be used as the root directory of the artifact. Exclude paths do not affect the directory structure.

Relative and absolute file paths are both allowed. Relative paths are rooted against the current working directory. Paths that begin with a wildcard character should be quoted to avoid being interpreted as YAML aliases.

The [@actions/artifact](https://github.com/actions/toolkit/tree/main/packages/artifact) package is used internally to handle most of the logic around uploading an artifact. There is extra documentation around upload limitations and behavior in the toolkit repo that is worth checking out.


### Keeping existing collection
By default, mongo-import clears the entire target collection before uploading new documents.
Use the `keep-collection` flag to prevent it from clearing the collection.

```yaml
steps:
- uses: actions/checkout@v3
- uses: actions/mongo-import@v1
  with:
    path: path/to/artifact/world.json
    keep-collection: true
    # ... uri, database, collection

```


### Customization if no files are found

If a path (or paths), result in no files being found for the artifact, the action will succeed but print out a warning. In certain scenarios it may be desirable to fail the action or suppress the warning. The `if-no-files-found` option allows you to customize the behavior of the action if no files are found:

```yaml
- uses: actions/mongo-import@v1
  with:
    path: path/to/artifact/
    if-no-files-found: error # 'warn' or 'ignore' are also available, defaults to `warn`
    # ... uri, database, collection
```

## Additional Documentation

See [Storing workflow data as artifacts](https://docs.github.com/en/actions/advanced-guides/storing-workflow-data-as-artifacts) for additional examples and tips.

See extra documentation for the [@actions/artifact](https://github.com/actions/toolkit/blob/main/packages/artifact/docs/additional-information.md) package that is used internally regarding certain behaviors and limitations.

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE).