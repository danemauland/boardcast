A simple Serverless app for video chat. The DDB Table has a "meetingConnection" item with five attributes: a meetingID, wsConnectionID, type of 'meetingConnection', userName, a pk of meeting#{meetingID}, and sk of wsConnection#{wsConnectionID}

The database also keeps track of the messages in each meeting. The messages have a primary key of meeting#{meetingID}, sk of message#{ISO-8601 timestamp}, a text attribute containing the chat message, a username containing the username of the user who sent the message, meetingID, wsConnectionID, and type of "message", and "timestamp"

To ensure uniqueness of wsConnectionIDs, the table contains another item type with pk of uniq#wsConnectionID#{wsConnectionID} and sk of 'uniq'

The DDB also has user collections. The partition key for these items is user#{username}. These collections contain an item with sk of details and a username attribute. The user collection contains another item representing the meeting that the user created. The sk for these items is meeting#{meetingTime}. These items also contain a timestamp and name attributes, as well as a type of "userMeeting"

The DDB has a singleton entity with pk: users, sk: count, and a count attribute which is used to generate the unique id for each user.