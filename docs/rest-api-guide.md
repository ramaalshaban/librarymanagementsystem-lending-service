# REST API GUIDE

## librarymanagementsystem-lending-service

Handles book lending lifecycle: checkouts, returns, renewals, member and librarian transactions, reservations (holds), overdue detection/events; tracks per-user and per-branch activity; provides real-time lending state for library network.

## Architectural Design Credit and Contact Information

The architectural design of this microservice is credited to .
For inquiries, feedback, or further information regarding the architecture, please direct your communication to:

Email:

We encourage open communication and welcome any questions or discussions related to the architectural aspects of this microservice.

## Documentation Scope

Welcome to the official documentation for the Lending Service's REST API. This document is designed to provide a comprehensive guide to interfacing with our Lending Service exclusively through RESTful API endpoints.

**Intended Audience**

This documentation is intended for developers and integrators who are looking to interact with the Lending Service via HTTP requests for purposes such as creating, updating, deleting and querying Lending objects.

**Overview**

Within these pages, you will find detailed information on how to effectively utilize the REST API, including authentication methods, request and response formats, endpoint descriptions, and examples of common use cases.

Beyond REST
It's important to note that the Lending Service also supports alternative methods of interaction, such as gRPC and messaging via a Message Broker. These communication methods are beyond the scope of this document. For information regarding these protocols, please refer to their respective documentation.

## Authentication And Authorization

To ensure secure access to the Lending service's protected endpoints, a project-wide access token is required. This token serves as the primary method for authenticating requests to our service. However, it's important to note that access control varies across different routes:

**Protected Routes**:
Certain routes require specific authorization levels. Access to these routes is contingent upon the possession of a valid access token that meets the route-specific authorization criteria. Unauthorized requests to these routes will be rejected.

**Public Routes**:
The service also includes routes that are accessible without authentication. These public endpoints are designed for open access and do not require an access token.

### Token Locations

When including your access token in a request, ensure it is placed in one of the following specified locations. The service will sequentially search these locations for the token, utilizing the first one it encounters.

| Location             | Token Name / Param Name              |
| -------------------- | ------------------------------------ |
| Query                | access_token                         |
| Authorization Header | Bearer                               |
| Header               | librarymanagementsystem-access-token |
| Cookie               | librarymanagementsystem-access-token |

Please ensure the token is correctly placed in one of these locations, using the appropriate label as indicated. The service prioritizes these locations in the order listed, processing the first token it successfully identifies.

## Api Definitions

This section outlines the API endpoints available within the Lending service. Each endpoint can receive parameters through various methods, meticulously described in the following definitions. It's important to understand the flexibility in how parameters can be included in requests to effectively interact with the Lending service.

This service is configured to listen for HTTP requests on port `3002`,
serving both the main API interface and default administrative endpoints.

The following routes are available by default:

- **API Test Interface (API Face):** `/`
- **Swagger Documentation:** `/swagger`
- **Postman Collection Download:** `/getPostmanCollection`
- **Health Checks:** `/health` and `/admin/health`
- **Current Session Info:** `/currentuser`
- **Favicon:** `/favicon.ico`

This service is accessible via the following environment-specific URLs:

- **Preview:** `https://lending-api-librarymanagementsystem.prw.mindbricks.com`
- **Staging:** `https://lending-api-librarymanagementsystem.staging.mindbricks.com`
- **Production:** `https://lending-api-librarymanagementsystem.prod.mindbricks.com`

**Parameter Inclusion Methods:**
Parameters can be incorporated into API requests in several ways, each with its designated location. Understanding these methods is crucial for correctly constructing your requests:

**Query Parameters:** Included directly in the URL's query string.

**Path Parameters:** Embedded within the URL's path.

**Body Parameters:** Sent within the JSON body of the request.

**Session Parameters:** Automatically read from the session object. This method is used for parameters that are intrinsic to the user's session, such as userId. When using an API that involves session parameters, you can omit these from your request. The service will automatically bind them to the route, provided that a session is associated with your request.

**Note on Session Parameters:**
Session parameters represent a unique method of parameter inclusion, relying on the context of the user's session. A common example of a session parameter is userId, which the service automatically associates with your request when a session exists. This feature ensures seamless integration of user-specific data without manual input for each request.

By adhering to the specified parameter inclusion methods, you can effectively utilize the Lending service's API endpoints. For detailed information on each endpoint, including required parameters and their accepted locations, refer to the individual API definitions below.

### Common Parameters

The `Lending` service's routes support several common parameters designed to modify and enhance the behavior of API requests. These parameters are not individually listed in the API route definitions to avoid repetition. Instead, refer to this section to understand how to leverage these common behaviors across different routes. Note that all common parameters should be included in the query part of the URL.

### Supported Common Parameters:

- **getJoins (BOOLEAN)**: Controls whether to retrieve associated objects along with the main object. By default, `getJoins` is assumed to be `true`. Set it to `false` if you prefer to receive only the main fields of an object, excluding its associations.

- **excludeCQRS (BOOLEAN)**: Applicable only when `getJoins` is `true`. By default, `excludeCQRS` is set to `false`. Enabling this parameter (`true`) omits non-local associations, which are typically more resource-intensive as they require querying external services like ElasticSearch for additional information. Use this to optimize response times and resource usage.

- **requestId (String)**: Identifies a request to enable tracking through the service's log chain. A random hex string of 32 characters is assigned by default. If you wish to use a custom `requestId`, simply include it in your query parameters.

- **caching (BOOLEAN)**: Determines the use of caching for query routes. By default, caching is enabled (`true`). To ensure the freshest data directly from the database, set this parameter to `false`, bypassing the cache.

- **cacheTTL (Integer)**: Specifies the Time-To-Live (TTL) for query caching, in seconds. This is particularly useful for adjusting the default caching duration (5 minutes) for `get list` queries. Setting a custom `cacheTTL` allows you to fine-tune the cache lifespan to meet your needs.

- **pageNumber (Integer)**: For paginated `get list` routes, this parameter selects which page of results to retrieve. The default is `1`, indicating the first page. To disable pagination and retrieve all results, set `pageNumber` to `0`.

- **pageRowCount (Integer)**: In conjunction with paginated routes, this parameter defines the number of records per page. The default value is `25`. Adjusting `pageRowCount` allows you to control the volume of data returned in a single request.

By utilizing these common parameters, you can tailor the behavior of API requests to suit your specific requirements, ensuring optimal performance and usability of the `Lending` service.

### Error Response

If a request encounters an issue, whether due to a logical fault or a technical problem, the service responds with a standardized JSON error structure. The HTTP status code within this response indicates the nature of the error, utilizing commonly recognized codes for clarity:

- **400 Bad Request**: The request was improperly formatted or contained invalid parameters, preventing the server from processing it.
- **401 Unauthorized**: The request lacked valid authentication credentials or the credentials provided do not grant access to the requested resource.
- **404 Not Found**: The requested resource was not found on the server.
- **500 Internal Server Error**: The server encountered an unexpected condition that prevented it from fulfilling the request.

Each error response is structured to provide meaningful insight into the problem, assisting in diagnosing and resolving issues efficiently.

```js
{
  "result": "ERR",
  "status": 400,
  "message": "errMsg_organizationIdisNotAValidID",
  "errCode": 400,
  "date": "2024-03-19T12:13:54.124Z",
  "detail": "String"
}
```

### Object Structure of a Successfull Response

When the `Lending` service processes requests successfully, it wraps the requested resource(s) within a JSON envelope. This envelope not only contains the data but also includes essential metadata, such as configuration details and pagination information, to enrich the response and provide context to the client.

**Key Characteristics of the Response Envelope:**

- **Data Presentation**: Depending on the nature of the request, the service returns either a single data object or an array of objects encapsulated within the JSON envelope.
  - **Creation and Update Routes**: These routes return the unmodified (pure) form of the data object(s), without any associations to other data objects.
  - **Delete Routes**: Even though the data is removed from the database, the last known state of the data object(s) is returned in its pure form.
  - **Get Requests**: A single data object is returned in JSON format.
  - **Get List Requests**: An array of data objects is provided, reflecting a collection of resources.

- **Data Structure and Joins**: The complexity of the data structure in the response can vary based on the route's architectural design and the join options specified in the request. The architecture might inherently limit join operations, or they might be dynamically controlled through query parameters.
  - **Pure Data Forms**: In some cases, the response mirrors the exact structure found in the primary data table, without extensions.
  - **Extended Data Forms**: Alternatively, responses might include data extended through joins with tables within the same service or aggregated from external sources, such as ElasticSearch indices related to other services.
  - **Join Varieties**: The extensions might involve one-to-one joins, resulting in single object associations, or one-to-many joins, leading to an array of objects. In certain instances, the data might even feature nested inclusions from other data objects.

**Design Considerations**: The structure of a route's response data is meticulously crafted during the service's architectural planning. This design ensures that responses adequately reflect the intended data relationships and service logic, providing clients with rich and meaningful information.

**Brief Data**: Certain routes return a condensed version of the object data, intentionally selecting only specific fields deemed useful for that request. In such instances, the route documentation will detail the properties included in the response, guiding developers on what to expect.

### API Response Structure

The API utilizes a standardized JSON envelope to encapsulate responses. This envelope is designed to consistently deliver both the requested data and essential metadata, ensuring that clients can efficiently interpret and utilize the response.

**HTTP Status Codes:**

- **200 OK**: This status code is returned for successful GET, GETLIST, UPDATE, or DELETE operations, indicating that the request has been processed successfully.
- **201 Created**: This status code is specific to CREATE operations, signifying that the requested resource has been successfully created.

**Success Response Format:**

For successful operations, the response includes a `"status": "OK"` property, signaling the successful execution of the request. The structure of a successful response is outlined below:

```json
{
  "status":"OK",
  "statusCode": 200,
  "elapsedMs":126,
  "ssoTime":120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName":"products",
  "method":"GET",
  "action":"getList",
  "appVersion":"Version",
  "rowCount":3
  "products":[{},{},{}],
  "paging": {
    "pageNumber":1,
    "pageRowCount":25,
    "totalRowCount":3,
    "pageCount":1
  },
  "filters": [],
  "uiPermissions": []
}
```

- **`products`**: In this example, this key contains the actual response content, which may be a single object or an array of objects depending on the operation performed.

**Handling Errors:**

For details on handling error scenarios and understanding the structure of error responses, please refer to the "Error Response" section provided earlier in this documentation. It outlines how error conditions are communicated, including the use of HTTP status codes and standardized JSON structures for error messages.

**Route Validation Layers:**

Route Validations may be executed in 4 different layers. The layer is a kind of time definition in the route life cycle. Note that while conditional check times are defined by layers, the fetch actions are defined by access times.

`layer1`: "The first layer of route life cycle which is just after the request parameters are validated and the request is in controller. Any script, validation or data operation in this layer can access the route parameters only. The beforeInstance data is not ready yet."

`layer2`: "The second layer of route life cycle which is just after beforeInstance data is collected before the main operation of the route and the main operation is not started yet. In this layer the collected supplementary data is accessable with the route parameters."

`layer3`: "The third layer of route life cycle which is just after the main operation of the route is completed. In this layer the main operation result is accessable with the beforeInstance data and route parameters. Note that the afterInstance data is not ready yet."

`layer4`: "The last layer of route life cycle which is just after afterInstance supplementary data is collected. In this layer the afterInstance data is accessable with the main operation result, beforeInstance data and route parameters."

## Resources

Lending service provides the following resources which are stored in its own database as a data object. Note that a resource for an api access is a data object for the service.

### Loan resource

_Resource Definition_ : Represents a book lending/checkout instance; tracks lending lifecycle (checkout, due, return, renewal/overdue status), related user, book, branch inventory.
_Loan Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **userId** | ID | | | _Member/user who is borrowing the book_ |
| **bookId** | ID | | | _ID of the borrowed book (catalog record)_ |
| **branchId** | ID | | | _Branch ID from which book was borrowed_ |
| **branchInventoryId** | ID | | | _ID of branchInventory record for the specific copy/copies lent_ |
| **status** | Enum | | | _Current status of the loan (active, returned, overdue, lost, canceled)_ |
| **checkedOutAt** | Date | | | _Datetime when loan/check-out started._ |
| **dueDate** | Date | | | _Due date that the book must be returned by._ |
| **returnedAt** | Date | | | _Datetime book was actually returned (null if outstanding)._ |
| **renewalCount** | Integer | | | _Number of times this loan has been renewed._ |
| **renewalHistory** | Object | | | _Array of renewal objects: {renewedAt: Date, renewedByUserId: ID, newDueDate: Date}. Stores all renewal actions for this loan._ |
| **lastRenewedAt** | Date | | | _Datetime of last renewal event for this loan._ |
| **checkedOutBy** | ID | | | _UserId who performed the checkout (could be librarian or the member themselves, for auditing)._ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### status Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **active** | `"active""` | 0 |
| **returned** | `"returned""` | 1 |
| **overdue** | `"overdue""` | 2 |
| **lost** | `"lost""` | 3 |
| **canceled** | `"canceled""` | 4 |

### Reservation resource

_Resource Definition_ : Reservation/Hold for a book at a branch; supports individual queue of reservation requests, fulfillment, and cancellation.
_Reservation Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **userId** | ID | | | _User/member requesting reservation._ |
| **bookId** | ID | | | _Book being reserved (catalog record)_ |
| **branchId** | ID | | | _Requested pickup/fulfillment branch for reservation_ |
| **status** | Enum | | | _Reservation status (active/waiting, fulfilled, canceled, expired, no-show)_ |
| **requestedAt** | Date | | | _Datetime reservation was requested._ |
| **queuePosition** | Integer | | | _If reservation is a queue, represents member&#39;s current position for this book at branch._ |
| **activationNotifiedAt** | Date | | | _Date/time reservation was activated (user notified item ready)._ |
| **fulfilledAt** | Date | | | _Datetime reservation was fulfilled (converted to loan or picked up)._ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### status Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **active** | `"active""` | 0 |
| **waiting** | `"waiting""` | 1 |
| **fulfilled** | `"fulfilled""` | 2 |
| **canceled** | `"canceled""` | 3 |
| **expired** | `"expired""` | 4 |
| **noShow** | `"noShow""` | 5 |

### LoanEvent resource

_Resource Definition_ : Log/audit entry for each major event in lending lifecycle: checkout, return, renewal, reservation fulfillment, overdue, cancellation, etc.
_LoanEvent Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **loanId** | ID | | | _ID of the loan related to the event_ |
| **eventType** | Enum | | | _Type of event in lending lifecycle (checkout, return, renewal, overdue, reservationFulfilled, cancellation, lost)._ |
| **eventDate** | Date | | | _Datetime event occurred (auto-now)._ |
| **actorUserId** | ID | | | _UserId performing the action (librarian or member)._ |
| **note** | Text | | | _Any note or annotation for this event (librarian input/logging)._ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### eventType Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **checkout** | `"checkout""` | 0 |
| **return** | `"return""` | 1 |
| **renewal** | `"renewal""` | 2 |
| **overdue** | `"overdue""` | 3 |
| **reservationFulfilled** | `"reservationFulfilled""` | 4 |
| **cancellation** | `"cancellation""` | 5 |
| **lost** | `"lost""` | 6 |

## Crud Routes

### Route: getLoan

_Route Definition_ : Get loan/checkout record by ID.

_Route Type_ : get

_Default access route_ : _GET_ `/loans/:loanId`

#### Parameters

The getLoan api has got 1 parameter

| Parameter | Type | Required | Population             |
| --------- | ---- | -------- | ---------------------- |
| loanId    | ID   | true     | request.params?.loanId |

To access the api you can use the **REST** controller with the path **GET /loans/:loanId**

```js
axios({
  method: "GET",
  url: `/loans/${loanId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`loan`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "loan",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "loan": { "id": "ID", "isActive": true }
}
```

### Route: createLoan

_Route Definition_ : Create a new loan (book checkout).

_Route Type_ : create

_Default access route_ : _POST_ `/loans`

#### Parameters

The createLoan api has got 12 parameters

| Parameter         | Type    | Required | Population                      |
| ----------------- | ------- | -------- | ------------------------------- |
| userId            | ID      | true     | request.body?.userId            |
| bookId            | ID      | true     | request.body?.bookId            |
| branchId          | ID      | true     | request.body?.branchId          |
| branchInventoryId | ID      | true     | request.body?.branchInventoryId |
| status            | Enum    | true     | request.body?.status            |
| checkedOutAt      | Date    | true     | request.body?.checkedOutAt      |
| dueDate           | Date    | true     | request.body?.dueDate           |
| returnedAt        | Date    | false    | request.body?.returnedAt        |
| renewalCount      | Integer | true     | request.body?.renewalCount      |
| renewalHistory    | Object  | false    | request.body?.renewalHistory    |
| lastRenewedAt     | Date    | false    | request.body?.lastRenewedAt     |
| checkedOutBy      | ID      | true     | request.body?.checkedOutBy      |

To access the api you can use the **REST** controller with the path **POST /loans**

```js
axios({
  method: "POST",
  url: "/loans",
  data: {
    userId: "ID",
    bookId: "ID",
    branchId: "ID",
    branchInventoryId: "ID",
    status: "Enum",
    checkedOutAt: "Date",
    dueDate: "Date",
    returnedAt: "Date",
    renewalCount: "Integer",
    renewalHistory: "Object",
    lastRenewedAt: "Date",
    checkedOutBy: "ID",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`loan`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "loan",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "loan": { "id": "ID", "isActive": true }
}
```

### Route: updateLoan

_Route Definition_ : Update loan. Used for renewal, return, overdue, and status transitions.

_Route Type_ : update

_Default access route_ : _PATCH_ `/loans/:loanId`

#### Parameters

The updateLoan api has got 7 parameters

| Parameter      | Type    | Required | Population                   |
| -------------- | ------- | -------- | ---------------------------- |
| loanId         | ID      | true     | request.params?.loanId       |
| status         | Enum    | false    | request.body?.status         |
| dueDate        | Date    | false    | request.body?.dueDate        |
| returnedAt     | Date    | false    | request.body?.returnedAt     |
| renewalCount   | Integer | false    | request.body?.renewalCount   |
| renewalHistory | Object  | false    | request.body?.renewalHistory |
| lastRenewedAt  | Date    | false    | request.body?.lastRenewedAt  |

To access the api you can use the **REST** controller with the path **PATCH /loans/:loanId**

```js
axios({
  method: "PATCH",
  url: `/loans/${loanId}`,
  data: {
    status: "Enum",
    dueDate: "Date",
    returnedAt: "Date",
    renewalCount: "Integer",
    renewalHistory: "Object",
    lastRenewedAt: "Date",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`loan`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "loan",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "loan": { "id": "ID", "isActive": true }
}
```

### Route: deleteLoan

_Route Definition_ : Soft-delete a loan record if needed for compliance or administrative erasure.

_Route Type_ : delete

_Default access route_ : _DELETE_ `/loans/:loanId`

#### Parameters

The deleteLoan api has got 1 parameter

| Parameter | Type | Required | Population             |
| --------- | ---- | -------- | ---------------------- |
| loanId    | ID   | true     | request.params?.loanId |

To access the api you can use the **REST** controller with the path **DELETE /loans/:loanId**

```js
axios({
  method: "DELETE",
  url: `/loans/${loanId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`loan`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "loan",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "loan": { "id": "ID", "isActive": false }
}
```

### Route: listLoans

_Route Definition_ : List/Query loans by user, book, branch, or status incl. active/outstanding loans, historical loans, or overdue.

_Route Type_ : getList

_Default access route_ : _GET_ `/loans`

The listLoans api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /loans**

```js
axios({
  method: "GET",
  url: "/loans",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`loans`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "loans",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "loans": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

### Route: getReservation

_Route Definition_ : Get reservation queue record by ID.

_Route Type_ : get

_Default access route_ : _GET_ `/reservations/:reservationId`

#### Parameters

The getReservation api has got 1 parameter

| Parameter     | Type | Required | Population                    |
| ------------- | ---- | -------- | ----------------------------- |
| reservationId | ID   | true     | request.params?.reservationId |

To access the api you can use the **REST** controller with the path **GET /reservations/:reservationId**

```js
axios({
  method: "GET",
  url: `/reservations/${reservationId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`reservation`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "reservation",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "reservation": { "id": "ID", "isActive": true }
}
```

### Route: createReservation

_Route Definition_ : Create new reservation/hold for a book at a branch.

_Route Type_ : create

_Default access route_ : _POST_ `/reservations`

#### Parameters

The createReservation api has got 8 parameters

| Parameter            | Type    | Required | Population                         |
| -------------------- | ------- | -------- | ---------------------------------- |
| userId               | ID      | true     | request.body?.userId               |
| bookId               | ID      | true     | request.body?.bookId               |
| branchId             | ID      | true     | request.body?.branchId             |
| status               | Enum    | true     | request.body?.status               |
| requestedAt          | Date    | true     | request.body?.requestedAt          |
| queuePosition        | Integer | false    | request.body?.queuePosition        |
| activationNotifiedAt | Date    | false    | request.body?.activationNotifiedAt |
| fulfilledAt          | Date    | false    | request.body?.fulfilledAt          |

To access the api you can use the **REST** controller with the path **POST /reservations**

```js
axios({
  method: "POST",
  url: "/reservations",
  data: {
    userId: "ID",
    bookId: "ID",
    branchId: "ID",
    status: "Enum",
    requestedAt: "Date",
    queuePosition: "Integer",
    activationNotifiedAt: "Date",
    fulfilledAt: "Date",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`reservation`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "reservation",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "reservation": { "id": "ID", "isActive": true }
}
```

### Route: updateReservation

_Route Definition_ : Update reservation queue status (fulfillment, cancellation, etc).

_Route Type_ : update

_Default access route_ : _PATCH_ `/reservations/:reservationId`

#### Parameters

The updateReservation api has got 5 parameters

| Parameter            | Type    | Required | Population                         |
| -------------------- | ------- | -------- | ---------------------------------- |
| reservationId        | ID      | true     | request.params?.reservationId      |
| status               | Enum    | false    | request.body?.status               |
| queuePosition        | Integer | false    | request.body?.queuePosition        |
| activationNotifiedAt | Date    | false    | request.body?.activationNotifiedAt |
| fulfilledAt          | Date    | false    | request.body?.fulfilledAt          |

To access the api you can use the **REST** controller with the path **PATCH /reservations/:reservationId**

```js
axios({
  method: "PATCH",
  url: `/reservations/${reservationId}`,
  data: {
    status: "Enum",
    queuePosition: "Integer",
    activationNotifiedAt: "Date",
    fulfilledAt: "Date",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`reservation`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "reservation",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "reservation": { "id": "ID", "isActive": true }
}
```

### Route: deleteReservation

_Route Definition_ : Soft-delete a reservation (for member cancel or admin purge.)

_Route Type_ : delete

_Default access route_ : _DELETE_ `/reservations/:reservationId`

#### Parameters

The deleteReservation api has got 1 parameter

| Parameter     | Type | Required | Population                    |
| ------------- | ---- | -------- | ----------------------------- |
| reservationId | ID   | true     | request.params?.reservationId |

To access the api you can use the **REST** controller with the path **DELETE /reservations/:reservationId**

```js
axios({
  method: "DELETE",
  url: `/reservations/${reservationId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`reservation`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "reservation",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "reservation": { "id": "ID", "isActive": false }
}
```

### Route: listReservations

_Route Definition_ : List/query reservations/holds for books at a branch or for user, filter by status, support for queue ops.

_Route Type_ : getList

_Default access route_ : _GET_ `/reservations`

The listReservations api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /reservations**

```js
axios({
  method: "GET",
  url: "/reservations",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`reservations`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "reservations",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "reservations": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

### Route: getLoanEvent

_Route Definition_ : Get lending event/audit record by ID.

_Route Type_ : get

_Default access route_ : _GET_ `/loanevents/:loanEventId`

#### Parameters

The getLoanEvent api has got 1 parameter

| Parameter   | Type | Required | Population                  |
| ----------- | ---- | -------- | --------------------------- |
| loanEventId | ID   | true     | request.params?.loanEventId |

To access the api you can use the **REST** controller with the path **GET /loanevents/:loanEventId**

```js
axios({
  method: "GET",
  url: `/loanevents/${loanEventId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`loanEvent`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "loanEvent",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "loanEvent": { "id": "ID", "isActive": true }
}
```

### Route: createLoanEvent

_Route Definition_ : Create a log/audit record of an event (checkout, return, overdue, etc) related to a loan.

_Route Type_ : create

_Default access route_ : _POST_ `/loanevents`

#### Parameters

The createLoanEvent api has got 5 parameters

| Parameter   | Type | Required | Population                |
| ----------- | ---- | -------- | ------------------------- |
| loanId      | ID   | true     | request.body?.loanId      |
| eventType   | Enum | true     | request.body?.eventType   |
| eventDate   | Date | true     | request.body?.eventDate   |
| actorUserId | ID   | true     | request.body?.actorUserId |
| note        | Text | false    | request.body?.note        |

To access the api you can use the **REST** controller with the path **POST /loanevents**

```js
axios({
  method: "POST",
  url: "/loanevents",
  data: {
    loanId: "ID",
    eventType: "Enum",
    eventDate: "Date",
    actorUserId: "ID",
    note: "Text",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`loanEvent`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "loanEvent",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "loanEvent": { "id": "ID", "isActive": true }
}
```

### Route: updateLoanEvent

_Route Definition_ : Update lending event record (rare; audit correction or note update).

_Route Type_ : update

_Default access route_ : _PATCH_ `/loanevents/:loanEventId`

#### Parameters

The updateLoanEvent api has got 2 parameters

| Parameter   | Type | Required | Population                  |
| ----------- | ---- | -------- | --------------------------- |
| loanEventId | ID   | true     | request.params?.loanEventId |
| note        | Text | false    | request.body?.note          |

To access the api you can use the **REST** controller with the path **PATCH /loanevents/:loanEventId**

```js
axios({
  method: "PATCH",
  url: `/loanevents/${loanEventId}`,
  data: {
    note: "Text",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`loanEvent`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "loanEvent",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "loanEvent": { "id": "ID", "isActive": true }
}
```

### Route: deleteLoanEvent

_Route Definition_ : Soft-delete a loan event for compliance or admin removal.

_Route Type_ : delete

_Default access route_ : _DELETE_ `/loanevents/:loanEventId`

#### Parameters

The deleteLoanEvent api has got 1 parameter

| Parameter   | Type | Required | Population                  |
| ----------- | ---- | -------- | --------------------------- |
| loanEventId | ID   | true     | request.params?.loanEventId |

To access the api you can use the **REST** controller with the path **DELETE /loanevents/:loanEventId**

```js
axios({
  method: "DELETE",
  url: `/loanevents/${loanEventId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`loanEvent`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "loanEvent",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "loanEvent": { "id": "ID", "isActive": false }
}
```

### Route: listLoanEvents

_Route Definition_ : List/query all loan event logs for loan, user, type, or event date.

_Route Type_ : getList

_Default access route_ : _GET_ `/loanevents`

The listLoanEvents api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /loanevents**

```js
axios({
  method: "GET",
  url: "/loanevents",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`loanEvents`** object in the respones. However, some properties may be omitted based on the object's internal logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "loanEvents",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "loanEvents": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

### Authentication Specific Routes

### Common Routes

### Route: currentuser

_Route Definition_: Retrieves the currently authenticated user's session information.

_Route Type_: sessionInfo

_Access Route_: `GET /currentuser`

#### Parameters

This route does **not** require any request parameters.

#### Behavior

- Returns the authenticated session object associated with the current access token.
- If no valid session exists, responds with a 401 Unauthorized.

```js
// Sample GET /currentuser call
axios.get("/currentuser", {
  headers: {
    Authorization: "Bearer your-jwt-token",
  },
});
```

**Success Response**
Returns the session object, including user-related data and token information.

```
{
  "sessionId": "9cf23fa8-07d4-4e7c-80a6-ec6d6ac96bb9",
  "userId": "d92b9d4c-9b1e-4e95-842e-3fb9c8c1df38",
  "email": "user@example.com",
  "fullname": "John Doe",
  "roleId": "user",
  "tenantId": "abc123",
  "accessToken": "jwt-token-string",
  ...
}
```

**Error Response**
**401 Unauthorized:** No active session found.

```
{
  "status": "ERR",
  "message": "No login found"
}
```

**Notes**

- This route is typically used by frontend or mobile applications to fetch the current session state after login.
- The returned session includes key user identity fields, tenant information (if applicable), and the access token for further authenticated requests.
- Always ensure a valid access token is provided in the request to retrieve the session.

### Route: permissions

`*Route Definition*`: Retrieves all effective permission records assigned to the currently authenticated user.

`*Route Type*`: permissionFetch

_Access Route_: `GET /permissions`

#### Parameters

This route does **not** require any request parameters.

#### Behavior

- Fetches all active permission records (`givenPermissions` entries) associated with the current user session.
- Returns a full array of permission objects.
- Requires a valid session (`access token`) to be available.

```js
// Sample GET /permissions call
axios.get("/permissions", {
  headers: {
    Authorization: "Bearer your-jwt-token",
  },
});
```

**Success Response**

Returns an array of permission objects.

```json
[
  {
    "id": "perm1",
    "permissionName": "adminPanel.access",
    "roleId": "admin",
    "subjectUserId": "d92b9d4c-9b1e-4e95-842e-3fb9c8c1df38",
    "subjectUserGroupId": null,
    "objectId": null,
    "canDo": true,
    "tenantCodename": "store123"
  },
  {
    "id": "perm2",
    "permissionName": "orders.manage",
    "roleId": null,
    "subjectUserId": "d92b9d4c-9b1e-4e95-842e-3fb9c8c1df38",
    "subjectUserGroupId": null,
    "objectId": null,
    "canDo": true,
    "tenantCodename": "store123"
  }
]
```

Each object reflects a single permission grant, aligned with the givenPermissions model:

- `**permissionName**`: The permission the user has.
- `**roleId**`: If the permission was granted through a role. -` **subjectUserId**`: If directly granted to the user.
- `**subjectUserGroupId**`: If granted through a group.
- `**objectId**`: If tied to a specific object (OBAC).
- `**canDo**`: True or false flag to represent if permission is active or restricted.

**Error Responses**

- **401 Unauthorized**: No active session found.

```json
{
  "status": "ERR",
  "message": "No login found"
}
```

- **500 Internal Server Error**: Unexpected error fetching permissions.

**Notes**

- The /permissions route is available across all backend services generated by Mindbricks, not just the auth service.
- Auth service: Fetches permissions freshly from the live database (givenPermissions table).
- Other services: Typically use a cached or projected view of permissions stored in a common ElasticSearch store, optimized for faster authorization checks.

> **Tip**:
> Applications can cache permission results client-side or server-side, but should occasionally refresh by calling this endpoint, especially after login or permission-changing operations.

### Route: permissions/:permissionName

_Route Definition_: Checks whether the current user has access to a specific permission, and provides a list of scoped object exceptions or inclusions.

_Route Type_: permissionScopeCheck

_Access Route_: `GET /permissions/:permissionName`

#### Parameters

| Parameter      | Type   | Required | Population                      |
| -------------- | ------ | -------- | ------------------------------- |
| permissionName | String | Yes      | `request.params.permissionName` |

#### Behavior

- Evaluates whether the current user **has access** to the given `permissionName`.
- Returns a structured object indicating:
  - Whether the permission is generally granted (`canDo`)
  - Which object IDs are explicitly included or excluded from access (`exceptions`)
- Requires a valid session (`access token`).

```js
// Sample GET /permissions/orders.manage
axios.get("/permissions/orders.manage", {
  headers: {
    Authorization: "Bearer your-jwt-token",
  },
});
```

**Success Response**

```json
{
  "canDo": true,
  "exceptions": [
    "a1f2e3d4-xxxx-yyyy-zzzz-object1",
    "b2c3d4e5-xxxx-yyyy-zzzz-object2"
  ]
}
```

- If `canDo` is `true`, the user generally has the permission, but not for the objects listed in `exceptions` (i.e., restrictions).
- If `canDo` is `false`, the user does not have the permission by default — but only for the objects in `exceptions`, they do have permission (i.e., selective overrides).
- The exceptions array contains valid **UUID strings**, each corresponding to an object ID (typically from the data model targeted by the permission).

## Copyright

All sources, documents and other digital materials are copyright of .

## About Us

For more information please visit our website: .

.
.
