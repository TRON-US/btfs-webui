/* global webuiUrl, ipfs page, describe, it, expect, beforeAll, afterAll */

const { createController } = require('ipfsd-ctl')

describe('Peers screen', () => {
  let ipfsd
  let peeraddr
  beforeAll(async () => {
    // spawn an ephemeral local node for manual swarm connect test
    ipfsd = await createController({
      type: 'go',
      ipfsBin: require('go-ipfs').path(),
      ipfsHttpModule: require('ipfs-http-client'),
      test: true,
      disposable: true
    })
    const { addresses } = await ipfsd.api.id()
    peeraddr = addresses.find((ma) => ma.toString().startsWith('/ip4/127.0.0.1')).toString()
    // connect to peer to have something  in the peer table
    await ipfs.swarm.connect(peeraddr)
    await page.goto(webuiUrl + '#/peers', { waitUntil: 'networkidle0' })
  })

  it('should have a clickable "Add connection" button', async () => {
    const addConnection = 'Add connection'
    await expect(page).toMatch(addConnection)
    await expect(page).toClick('button', { text: addConnection })
    await page.waitForSelector('div[role="dialog"]')
    await expect(page).toMatch('Insert the peer address you want to connect to')
  })

  it('should confirm connection after "Add connection" ', async () => {
    // enter multiaddr of a disposable local node spawned for this test
    await page.type('div[role="dialog"] input[type="text"]', peeraddr)
    // hit Enter
    await page.keyboard.type('\n')
    // expect connection confirmation
    await page.waitForSelector('.bg-green', { visible: true })
    await expect(page).toMatch('Successfully connected to the provided peer')
  })

  it('should have a peer from a "Local Network"', async () => {
    await expect(page).toMatch('Local Network')
  })

  afterAll(async () => {
    if (ipfsd) await ipfsd.stop()
  })
})
