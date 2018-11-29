## Queued Api Calls

This application runs concurrent API requests. 
To do this, all API URLs are defined by parameters, 
added to the queue, and then executed. 
The return values or messages are written in log files by Winston logger.

Example:

```json
{
    "params": [
        {
            "id": 123,
            "name": "foo"
        },
        {
            "id": 456,
            "name": "bar"
        },
        {
            "id": 789,
            "name": "baz"
        }
    ]
}
```

The data file above (located in `./data`) will result in the following URLs:
```
http://queue.local/123/foo
http://queue.local/456/bar
http://queue.local/789/baz
```
The base URL is configurable in `./src/Environment.js`
You can also provide a data file and base URL for production and development separately.

### Requirements for the backend
The Backend should return one of the following states:
```
info
error
success
```
The response should look like this:
````php
return [
    'status' => 'error',
    'message' => 'An additional message',
    'data' => json_encode(['Additional data (optional)']),
]
````