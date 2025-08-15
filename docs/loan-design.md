# Service Design Specification - Object Design for loan

**librarymanagementsystem-lending-service** documentation

## Document Overview

This document outlines the object design for the `loan` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## loan Data Object

### Object Overview

**Description:** Represents a book lending/checkout instance; tracks lending lifecycle (checkout, due, return, renewal/overdue status), related user, book, branch inventory.

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** No — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Composite Indexes

- **byUserStatus**: [userId, status]
  This composite index is defined to optimize query performance for complex queries involving multiple fields.

The index also defines a conflict resolution strategy for duplicate key violations.

When a new record would violate this composite index, the following action will be taken:

**On Duplicate**: `throwError`

An error will be thrown, preventing the insertion of conflicting data.

- **byBookBranchStatus**: [bookId, branchId, status]
  This composite index is defined to optimize query performance for complex queries involving multiple fields.

The index also defines a conflict resolution strategy for duplicate key violations.

When a new record would violate this composite index, the following action will be taken:

**On Duplicate**: `throwError`

An error will be thrown, preventing the insertion of conflicting data.

### Properties Schema

| Property            | Type    | Required | Description                                                                                                                   |
| ------------------- | ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `userId`            | ID      | Yes      | Member/user who is borrowing the book                                                                                         |
| `bookId`            | ID      | Yes      | ID of the borrowed book (catalog record)                                                                                      |
| `branchId`          | ID      | Yes      | Branch ID from which book was borrowed                                                                                        |
| `branchInventoryId` | ID      | Yes      | ID of branchInventory record for the specific copy/copies lent                                                                |
| `status`            | Enum    | Yes      | Current status of the loan (active, returned, overdue, lost, canceled)                                                        |
| `checkedOutAt`      | Date    | Yes      | Datetime when loan/check-out started.                                                                                         |
| `dueDate`           | Date    | Yes      | Due date that the book must be returned by.                                                                                   |
| `returnedAt`        | Date    | No       | Datetime book was actually returned (null if outstanding).                                                                    |
| `renewalCount`      | Integer | Yes      | Number of times this loan has been renewed.                                                                                   |
| `renewalHistory`    | Object  | No       | Array of renewal objects: {renewedAt: Date, renewedByUserId: ID, newDueDate: Date}. Stores all renewal actions for this loan. |
| `lastRenewedAt`     | Date    | No       | Datetime of last renewal event for this loan.                                                                                 |
| `checkedOutBy`      | ID      | Yes      | UserId who performed the checkout (could be librarian or the member themselves, for auditing).                                |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Array Properties

`renewalHistory`

Array properties can hold multiple values and are indicated by the `[]` suffix in their type. Avoid using arrays in properties that are used for relations, as they will not work correctly.
Note that using connection objects instead of arrays is recommended for relations, as they provide better performance and flexibility.

### Default Values

Default values are automatically assigned to properties when a new object is created, if no value is provided in the request body.
Since default values are applied on db level, they should be literal values, not expressions.If you want to use expressions, you can use transposed parameters in any crud route to set default values dynamically.

- **renewalHistory**: []

### Constant Properties

`userId` `bookId` `branchId` `branchInventoryId` `checkedOutAt` `checkedOutBy`

Constant properties are defined to be immutable after creation, meaning they cannot be updated or changed once set. They are typically used for properties that should remain constant throughout the object's lifecycle.
A property is set to be constant if the `Allow Update` option is set to `false`.

### Auto Update Properties

`userId` `bookId` `branchId` `branchInventoryId` `status` `checkedOutAt` `dueDate` `returnedAt` `renewalCount` `renewalHistory` `lastRenewedAt` `checkedOutBy`

An update crud route created with the option `Auto Params` enabled will automatically update these properties with the provided values in the request body.
If you want to update any property in your own business logic not by user input, you can set the `Allow Auto Update` option to false.
These properties will be added to the update route's body parameters and can be updated by the user if any value is provided in the request body.

### Enum Properties

Enum properties are defined with a set of allowed values, ensuring that only valid options can be assigned to them.
The enum options value will be stored as strings in the database,
but when a data object is created an addtional property with the same name plus an idx suffix will be created, which will hold the index of the selected enum option.
You can use the index property to sort by the enum value or when your enum options represent a sequence of values.

- **status**: [active, returned, overdue, lost, canceled]

### Elastic Search Indexing

`userId` `bookId` `branchId` `branchInventoryId` `status` `checkedOutAt` `dueDate` `returnedAt` `lastRenewedAt`

Properties that are indexed in Elastic Search will be searchable via the Elastic Search API.
While all properties are stored in the elastic search index of the data object, only those marked for Elastic Search indexing will be available for search queries.

### Database Indexing

`userId` `bookId` `branchId` `branchInventoryId` `status`

Properties that are indexed in the database will be optimized for query performance, allowing for faster data retrieval.
Make a property indexed in the database if you want to use it frequently in query filters or sorting.

### Relation Properties

`userId` `bookId` `branchId` `branchInventoryId` `checkedOutBy`

Mindbricks supports relations between data objects, allowing you to define how objects are linked together.
You can define relations in the data object properties, which will be used to create foreign key constraints in the database.
For complex joins operations, Mindbricks supportsa BFF pattern, where you can view dynamic and static views based on Elastic Search Indexes.
Use db level relations for simple one-to-one or one-to-many relationships, and use BFF views for complex joins that require multiple data objects to be joined together.

- **userId**: ID
  Relation to `user`.id

The target object is a parent object, meaning that the relation is a one-to-many relationship from target to this object.

On Delete: Set Null
Required: Yes

- **bookId**: ID
  Relation to `book`.id

The target object is a parent object, meaning that the relation is a one-to-many relationship from target to this object.

On Delete: Set Null
Required: Yes

- **branchId**: ID
  Relation to `branch`.id

The target object is a parent object, meaning that the relation is a one-to-many relationship from target to this object.

On Delete: Set Null
Required: Yes

- **branchInventoryId**: ID
  Relation to `branch or omit if &#39;branchInventory&#39; does not exist`.id

The target object is a parent object, meaning that the relation is a one-to-many relationship from target to this object.

On Delete: Set Null
Required: Yes

- **checkedOutBy**: ID
  Relation to `user`.id

The target object is a sibling object, meaning that the relation is a many-to-one or one-to-one relationship from this object to the target.

On Delete: Set Null
Required: Yes

### Filter Properties

`userId` `bookId` `branchId` `branchInventoryId` `status` `checkedOutAt` `dueDate` `returnedAt` `renewalCount` `checkedOutBy`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **userId**: ID has a filter named `userId`

- **bookId**: ID has a filter named `bookId`

- **branchId**: ID has a filter named `branchId`

- **branchInventoryId**: ID has a filter named `branchInventoryId`

- **status**: Enum has a filter named `status`

- **checkedOutAt**: Date has a filter named `checkedOutAt`

- **dueDate**: Date has a filter named `dueDate`

- **returnedAt**: Date has a filter named `returnedAt`

- **renewalCount**: Integer has a filter named `renewalCount`

- **checkedOutBy**: ID has a filter named `checkedOutBy`
