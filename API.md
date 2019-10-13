# CriticalBike API documentation

## Authentication
Make sure to populate the `X-UID` header with your user id (in the format of a uuid). You can choose any id you want. It is used to identify you later on, when editing groups you created or when you want to participate

## Errors

When the server encounteres an error, you should always get a response with this structure:
```js
{
  message: <string>,
  errors: <any>
}
```

where `message` is a human readable error message, and `errors` are various extra bits of information that might help you diagnose the problem.

## Entities
* [Groups](#groups)
* [Participants](#participants)


## Groups

```js
{
  id: <uuidv4>,
  address: <string>,
  destination: <string>,
  lat: <latitude string>,
  lon: <longitude string>,
  description: <string>,
  isCreator: <boolean>,
  time: <timestamp>,
  participants: [
    {
      group: <group id>,
      name: <string>,
      isMe: <boolean>
    },
    // ...
  ]
}
```

The timestamp is interpreted as milliseconds in the local timezone (no conversion is done).

#### `GET /api/groups`

Get a list of groups. Query parameter options:

* `from=t` only show groups that are starting later than `t`
* `limit=n` limit the number of groups to `n` (default 100)
* `offset=k` skip the first (newest) `k` entries (default 0)

#### `POST /api/groups`

Create a group. Supply group json in request body. Available fields are:
* `address` (length: 128)
* `time`
* `lat`
* `lon`
* `destination` (optional) (length: 128)
* `description` (optional) (length: 1024)

Other fields will be ignored.

The response is a 201 status code with the created group as body.

When the creation fails, you get a 400 error response

#### `POST /api/groups/:groupsId`

Edit a group where you are the owner. Editable fields are:
* `destination`
* `lat`
* `lon`
* `description`
* `address`
* `time`

The response is a 200 status code with the created group as body.

If you are not the owner or the group does not exist, it's a 404 instead.

#### `DELETE /api/groups/:groupsId`

Delete a group, where you are the owner

## Participants

```js
{
  name: <string>,
  group: <uuidv4>,
  isMe: <boolean>
}
```

When successful, you get a 401 no content response.

If you are not the owner or the group does not exist, it's a 404 instead.

#### `POST /api/groups/:groupId/part`

Create a participation. Available fields are:
* `name` your username

Response is a 201 status code with the complete group json in the response body.

#### `DELETE /api/groups/:groupId/part/:partId`

Delete a participant. Response is either a 200 status code if the participant was deleted successfully (with the group json as body in the response), or a 404 if no such participant was found.
