import * as utils from '../../utils/idGenerator';
jest.mock('../../utils/idGenerator', () => ({
  generateId: jest.fn()
}));
(utils.generateId as jest.Mock).mockReturnValue('mock-id');

import { XmlAdapter } from '../XmlAdapter';
import { exampleTree, expectedXml } from '../../test/testData';
import { removeTreeNodeArrayElementNames, stringifyAllTreeNodeValues } from '../../utils/treeTestUtils';

describe('XmlAdapter', () => {
  let adapter: XmlAdapter;

  beforeEach(() => {
    adapter = new XmlAdapter();
  });

  it('should parse XML to tree structure', async () => {
    const result = await adapter.parse(expectedXml);
    const expected = stringifyAllTreeNodeValues(exampleTree);
    expect(result).toEqual(expected);
  });

  it('should stringify tree structure to XML', async () => {
    const tree = removeTreeNodeArrayElementNames(structuredClone(exampleTree), "tags");
    const result = await adapter.stringify(tree);
    expect(result).toBe(expectedXml);
  });
});