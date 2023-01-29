# Guidelines

Guidelines about dealing with DTO classes, entity classes, validators and transformations.

Since it's not 100% clear when data will be transformed and/or validated, and what will be the result of such transformations, sometimes it's a bit hard to understand what's going on with the data processing.

1. Entities must have no validations (only DTOs have validations).
2. Services must work well (perform validations, etc) even if being executed in a worker process, cron job, script, etc (i.e. no controllers, pipes, middlewares should be necessary).
3. ~~Transformations should be idempotent (because the framework may execute them multiple times).~~ (Update: I have some transformations that decrease the page number by 1, but it seems to be executed only once).
4. Transformations used in DTOs should return a value of the original type (e.g. `trim` is `string -> string`).
5. Transformations used in entity classes may or may not return a value of the same type. This is because entity transformations are used as serializers when used in API controllers (as JSON output). For this reason, make sure not to execute entity transformations manually elsewhere.
6. `plainToInstance` seems to execute transformations. So when creating an entity instance from a plain object, if I execute this method, the object will be serialized (it will get the user-friendly format), and some properties will become useless (e.g. some properties will be excluded, and some will be transformed to a different type). Note that `transformAndValidateSync` executes `plainToInstance` internally.
7. Properties in entity classes (and all classes actually) can be undefined. This is because TypeORM requires `strictPropertyInitialization: true` (not a good solution), which also means entity classes may be built using a partial object (incomplete entity). For this reason, data mapping methods may omit some data, but it still works when using it as input for `.save`, `.update`, etc. methods.
8. Everytime we execute `.create`, `.save`, `.update`, etc, we should have already validated the input object manually (usually a DTO or a primitive value for simpler services, since entities have no validations).
