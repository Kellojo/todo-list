/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_113564862")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id = @collection.todos.list.owner",
    "deleteRule": "@request.auth.id = @collection.todos.list.owner",
    "listRule": "@request.auth.id = @collection.todo_lists.owner.id",
    "updateRule": "@request.auth.id = @collection.todos.list.owner",
    "viewRule": "@request.auth.id = @collection.todos.list.owner"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_113564862")

  // update collection data
  unmarshal({
    "createRule": "",
    "deleteRule": "",
    "listRule": "",
    "updateRule": "",
    "viewRule": ""
  }, collection)

  return app.save(collection)
})
