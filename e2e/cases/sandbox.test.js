import { Selector } from 'testcafe';

/* global fixture, test */

function url(x = '') {
  return process.env.BASE_URL + x;
}

const h3 = Selector('h3');
const h4 = Selector('h4');
const pre = Selector('pre');
const input = Selector('input');
const button = Selector('button');
const menuItem = Selector('li[role=menuitem]');

fixture('smoo')
  .page(url());

test('it just works...', async t => {
  await t
    .expect(h3.exists).notOk();

  await t
    .click(button.withText('Open modal'))
    .expect(h3.count).eql(1)
    .expect(h3.textContent)
    .contains('It works.');
});

test('it handle modals', async t => {
  await t
    .click(button.withText('Open modal'))
    .click(button.withText('nested'));

  await t
    .expect(h4.count).eql(1)
    .expect(h4.textContent)
    .contains('Sub modal');
});

test('it handle search input', async t => {
  await t
    .expect(pre.textContent)
    .contains('Got: []');

  await t
    .expect(menuItem.count).eql(2)
    .expect(menuItem.visible).notOk()
    .click(input);

  await t
    .expect(menuItem.count).eql(2)
    .typeText(input, 'do', { replace: true });

  await t
    .expect(menuItem.visible).ok()
    .expect(menuItem.count).eql(1);

  await t
    .click(Selector('#search-id-1'))
    .expect(pre.textContent)
    .contains('Got: [1]');
});
