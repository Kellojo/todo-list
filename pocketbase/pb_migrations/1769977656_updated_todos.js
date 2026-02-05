/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_113564862");

    // update collection data
    unmarshal(
      {
        createRule: "@request.auth.id = @collection.todo_lists.owner.id",
        deleteRule: "@request.auth.id = @collection.todo_lists.owner.id",
        listRule: "@request.auth.id = @collection.todo_lists.owner.id",
        updateRule: "@request.auth.id = @collection.todo_lists.owner.id",
        viewRule: "@request.auth.id = @collection.todo_lists.owner.id",
      },
      collection,
    );

    return app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("pbc_113564862");

    // update collection data
    unmarshal(
      {
        createRule: "",
        deleteRule: "",
        listRule: "",
        updateRule: "",
        viewRule: "",
      },
      collection,
    );

    return app.save(collection);
  },
);
