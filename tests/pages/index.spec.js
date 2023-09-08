'use strict'

const path = require('path')
const { loadPage } = require('../util')

test('home page matches snapshot', async () => {
  const homepage = await loadPage(
    path.join(__dirname, '../../_site/index.html'),
  )
  expect(homepage).toMatchSnapshot()
})
