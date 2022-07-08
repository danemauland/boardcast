import { handler } from "@svc/handlers/connect"
import { buildWSConnectionKeys } from "@svc/lib/buildWSConnectionKeys"
import { REGION, TableName } from "@svc/lib/config"
import { removeConnection } from "@svc/lib/removeConnection"
import { APIGatewayEvent } from "aws-lambda"

describe('connect', () => {
  const meetingID = 'testConnectMeetingID'
  const connectionId = 'testConnectConnectionID'

  it('returns an error if the meetingID querystring is missing', async () => {
    const params = {
      queryStringParameters: {meetingID: undefined, email: 'test'},
      requestContext: {connectionId,}
    } as unknown as APIGatewayEvent
    
    const status = await handler(params)

    expect(status.statusCode).toBe(500)
    expect(status.body).toContain('meetingID')
  })

  it('returns an error if the wsConnectionID is missing', async () => {
    const params = {
      queryStringParameters: {meetingID, email: 'test'},
      requestContext: {connectionId: undefined}
    } as unknown as APIGatewayEvent
    
    const status = await handler(params)

    expect(status.statusCode).toBe(500)
    expect(status.body).toContain('wsConnectionID')
  })

  it('returns an error if the email is missing', async () => {
    const params = {
      queryStringParameters: {meetingID, email: undefined},
      requestContext: {connectionId}
    } as unknown as APIGatewayEvent
    
    const status = await handler(params)

    expect(status.statusCode).toBe(500)
    expect(status.body).toContain('email')
  })

  it('adds the meetingID, wsConnectionID, and email to the DDB if successful', async () => {
    const params = {
      queryStringParameters: {meetingID, email: 'testUser'},
      requestContext: {connectionId}
    } as unknown as APIGatewayEvent

    const status = await handler(params)

    expect(status.statusCode).toBe(200)
    await expect({region: REGION, table: TableName}).toHaveItem(buildWSConnectionKeys({wsConnectionID: connectionId, meetingID}), expect.objectContaining({email: 'testUser'}))
  })

  afterAll(() => removeConnection(connectionId))
})