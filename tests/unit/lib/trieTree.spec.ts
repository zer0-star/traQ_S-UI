import TrieTree, { Word } from '@/lib/trieTree'

const users1: Array<Word> = [
  { type: 'user', text: '@temma' },
  { type: 'user', text: '@takashi_trap' },
  { type: 'user', text: '@takashi' },
  { type: 'user', text: '@' }
]
const users2: Array<Word> = [
  { type: 'user', text: '@sappi_red' },
  { type: 'user', text: '@abc' }
]
const stamps: Array<Word> = [
  { type: 'stamp', text: ':partying_face' },
  { type: 'stamp', text: ':thermometer' },
  { type: 'stamp', text: ':thermometer_face' }
]
const stampEffects: Array<Word> = [
  { type: 'user', text: '.wiggle' },
  { type: 'user', text: '.ex-large' }
]
const empty: Array<Word> = []

const tree = new TrieTree(users1, users2, stamps, stampEffects, empty)

describe('trieTree class', () => {
  it('can create', () => {
    expect(Object.keys(tree.root.children).length !== 0).toEqual(true)
  })
  it('can isWord', () => {
    expect(
      tree.root.children['@'].children['a'].children['b'].children['c'].isWord
    ).toEqual(true)
  })
  it('can search', () => {
    expect(tree.search('@ta')).toEqual([
      { type: 'user', text: '@takashi' },
      { type: 'user', text: '@takashi_trap' }
    ])
  })
  it('is case insensitive', () => {
    expect(tree.search('@SAPP')).toEqual([{ type: 'user', text: '@sappi_red' }])
  })
  it('cannot overwrite a word which is same when case insensitive', () => {
    const before = tree.search('@temma')
    tree.insert({ type: 'user', text: '@TEMMA' })
    expect(before).toEqual(tree.search('@temma'))
  })
  it('can insert', () => {
    tree.insert({ type: 'user', text: '@ryoha' })
    expect(tree.search('@r')).toEqual([{ type: 'user', text: '@ryoha' }])
  })
  it('cannot insert blank as a word', () => {
    tree.insert({ type: 'user', text: '' })
    expect(tree.root.children['']).toEqual(undefined)
  })
  it('can remove', () => {
    tree.remove('@ryoha')
    expect(tree.search('@ryoha')).toEqual([])
  })
  it('can handle blank removal', () => {
    const before = tree
    tree.remove('')
    expect(before).toEqual(tree)
  })
  it('can update', () => {
    tree.update(
      { type: 'user', text: '@sappi_red' },
      { type: 'user', text: '@sapphi_red' }
    )
    expect(tree.search('@sapp')).toEqual([
      { type: 'user', text: '@sapphi_red' }
    ])
  })
})