/* global webuiUrl, ipfs, page, describe, it, expect, beforeAll */

describe('Settings screen', () => {
  beforeAll(async () => {
    await page.goto(webuiUrl + '#/settings', { waitUntil: 'networkidle0' })
  })

  it('should show config of BTFS node', async () => {
    await expect(page).toMatch('Addresses')
    await expect(page).toMatch('Bootstrap')
    await expect(page).toMatch('PeerID')
    // check PeerID in config to confirm it comes from expected instance
    const { id } = await ipfs.id()
    await expect(page).toMatch(id)
  })
})
